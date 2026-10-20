const KEY='emberfall-player-v1', QUEUE='emberfall-pending-v1';
export const isBetter=(a,b)=>!b || a.survivedMs>b.survivedMs || (a.survivedMs===b.survivedMs && a.kills>b.kills);
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class PlayerRecords {
  constructor({storage, request=globalThis.fetch?.bind(globalThis), crypto=globalThis.crypto, changed=()=>{}}={}) {
    try{this.storage=storage??globalThis.localStorage}catch{this.storage=null}
    this.request=request;this.crypto=crypto;this.changed=changed;
    this.identity=this.read(KEY);this.pending=this.read(QUEUE);this.player=null;
    this.message=this.identity?'Your profile is saved on this browser.':'Choose a nickname to join the leaderboard.';
    this.syncing=null;this.queueDurable=true;
  }
  read(key){try{return JSON.parse(this.storage.getItem(key))}catch{return null}}
  write(key,value){try{this.storage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  async api(path,{method='GET',data,auth=true}={}) {
    const headers={};
    if(auth&&this.identity)headers.Authorization='Bearer '+this.identity.token;
    if(data)headers['Content-Type']='application/json';
    const response=await this.request('/api/'+path,{method,headers,body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(20000)});
    const result=await response.json().catch(()=>({error:'Online records are unavailable on this host.'}));
    if(!response.ok)throw new Error(result.error||'Online records are unavailable.');
    return result;
  }
  notify(message){this.message=message;this.changed()}
  async restore(){
    if(!this.identity)return;
    try{this.player=await this.api('player');this.identity.nickname=this.player.nickname;this.write(KEY,this.identity);this.changed();await this.flush()}
    catch{this.notify('Could not reach your profile. Your saved identity is kept; try again later.')}
  }
  async saveNickname(nickname){
    if(!this.identity){
      const token=Array.from(this.crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
      // Save the credential before making a request, so network retries keep the account.
      if(!this.write(KEY,{token}))throw new Error('Allow browser storage to keep your player account.');
      this.identity={token};
    }
    this.player=await this.api('player',{method:'PUT',data:{nickname}});
    this.identity.nickname=this.player.nickname;this.write(KEY,this.identity);
    this.notify('Profile saved. Your player ID stays the same when you change your nickname.');
    await this.flush();return this.player;
  }
  complete({time,kills,classId}){
    const record={survivedMs:Math.floor(time*1000),kills,classId};
    if(record.survivedMs<1)return;
    if(isBetter(record,this.pending)){this.pending=record;this.queueDurable=this.write(QUEUE,record)}
    if(!this.queueDurable)this.notify('Browser storage is blocked. Keep this page open until your run uploads.');
    else if(!this.identity?.nickname)this.notify('Run saved on this browser. Choose a nickname in Leaderboard to publish it.');
    void this.flush();
  }
  flush(){
    if(this.syncing)return this.syncing;
    if(!this.pending||!this.identity?.nickname)return Promise.resolve();
    this.syncing=(async()=>{
      try{
        while(this.pending){
          const record=this.pending;
          this.notify('Saving your best run…');
          const result=await this.api('records',{method:'POST',data:record});
          this.player=result.player;
          if(this.pending===record){this.pending=null;this.write(QUEUE,null)}
          this.notify('Your best run is saved online.');
        }
      }catch{this.notify('Upload pending. Your run is kept on this browser; open Leaderboard to retry.')}
      finally{this.syncing=null}
    })();
    return this.syncing;
  }
  async leaderboard(){return (await this.api('leaderboard',{auth:false})).entries}
}
