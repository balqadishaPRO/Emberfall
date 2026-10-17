//go:build js && wasm

package main
import("encoding/json";"strconv";"syscall/js";"gamat/internal/game")
var current *game.Game
func main(){
 js.Global().Set("gamatNew",js.FuncOf(func(this js.Value,a []js.Value)any{seed,_:=strconv.ParseInt(a[0].String(),10,64);current=game.New(seed,a[1].String());return snapshot()}))
 js.Global().Set("gamatStep",js.FuncOf(func(this js.Value,a []js.Value)any{if current==nil{return "null"};current.Step(a[0].Float());return snapshot()}))
 js.Global().Set("gamatSend",js.FuncOf(func(this js.Value,a []js.Value)any{return current!=nil&&current.Send(a[0].Int(),a[1].Int(),1,a[2].Float())}))
 js.Global().Set("gamatUpgrade",js.FuncOf(func(this js.Value,a []js.Value)any{return current!=nil&&current.Upgrade(a[0].Int(),1)}))
 select{}
}
func snapshot()string{b,_:=json.Marshal(current);return string(b)}
