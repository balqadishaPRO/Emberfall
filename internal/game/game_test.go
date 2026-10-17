package game

import (
	"encoding/json"
	"testing"
)

func TestSeedAndSimulation(t *testing.T) {
	a, b := New(42, "normal"), New(42, "normal")
	for i := 0; i < 3000; i++ {
		a.Step(.1)
		b.Step(.1)
	}
	x, _ := json.Marshal(a)
	y, _ := json.Marshal(b)
	if string(x) != string(y) {
		t.Fatal("seeded simulation diverged")
	}
	if a.Status == "playing" {
		t.Fatal("match must finish within five minutes")
	}
}
func TestOrders(t *testing.T) {
	g := New(1, "normal")
	if g.Send(1, 0, 1, .5) || g.Send(0, 0, 1, .5) || g.Send(-1, 0, 1, .5) || g.Send(0, 2, 1, 2) {
		t.Fatal("accepted invalid order")
	}
	if !g.Send(0, 2, 1, .8) {
		t.Fatal("valid order rejected")
	}
	for i := 0; i < 100; i++ {
		g.Step(.1)
	}
	if g.Nodes[2].Owner != 1 {
		t.Fatal("fleet did not capture target")
	}
}
func TestUpgrade(t *testing.T) {
	g := New(1, "normal")
	if !g.Upgrade(0, 1) || g.Nodes[0].Level != 2 || g.Nodes[0].Units != 25 {
		t.Fatal("upgrade failed")
	}
	if g.Upgrade(1, 1) {
		t.Fatal("upgraded enemy")
	}
}
