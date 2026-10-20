// Optional: postman request GET http://127.0.0.1:8080/api/leaderboard --script-post-request @scripts/leaderboard-check.cjs
pm.test('Leaderboard is available', () => pm.response.to.have.status(200));
pm.test('Public ranking is bounded, ordered, and contains no credentials', () => {
  const rows=pm.response.json().entries;
  pm.expect(rows).to.be.an('array');
  pm.expect(rows.length).to.be.at.most(50);
  for(let i=0;i<rows.length;i++) {
    pm.expect(rows[i].rank).to.eql(i+1);
    pm.expect(rows[i]).not.to.have.property('token_hash');
    pm.expect(rows[i]).not.to.have.property('token');
    if(i) pm.expect(rows[i].survivedMs).to.be.at.most(rows[i-1].survivedMs);
  }
});
