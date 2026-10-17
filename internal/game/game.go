package game

import (
	"math"
	"math/rand"
)

type Node struct {
	ID    int     `json:"id"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	Owner int     `json:"owner"`
	Units float64 `json:"units"`
	Level int     `json:"level"`
}
type Fleet struct {
	From     int     `json:"from"`
	To       int     `json:"to"`
	Owner    int     `json:"owner"`
	Units    int     `json:"units"`
	Progress float64 `json:"progress"`
	Duration float64 `json:"duration"`
}
type Game struct {
	Nodes      []Node  `json:"nodes"`
	Fleets     []Fleet `json:"fleets"`
	Time       float64 `json:"time"`
	Status     string  `json:"status"`
	Difficulty string  `json:"difficulty"`
	Captures   int     `json:"captures"`
	Sent       int     `json:"sent"`
	botClock   float64
	rng        *rand.Rand
}

func New(seed int64, difficulty string) *Game {
	g := &Game{Status: "playing", Difficulty: difficulty, Fleets: []Fleet{}, rng: rand.New(rand.NewSource(seed))}
	positions := [][2]float64{{105, 300}, {895, 300}, {290, 160}, {290, 440}, {500, 90}, {500, 300}, {500, 510}, {710, 160}, {710, 440}}
	for i, p := range positions {
		owner := 0
		units := float64(12 + g.rng.Intn(15))
		if i == 0 {
			owner = 1
			units = 45
		}
		if i == 1 {
			owner = 2
			units = 45
		}
		g.Nodes = append(g.Nodes, Node{ID: i, X: p[0], Y: p[1], Owner: owner, Units: units, Level: 1})
	}
	return g
}
func (g *Game) Send(from, to, owner int, fraction float64) bool {
	if g.Status != "playing" || from < 0 || to < 0 || from >= len(g.Nodes) || to >= len(g.Nodes) || from == to || fraction <= 0 || fraction > 1 {
		return false
	}
	n := &g.Nodes[from]
	if n.Owner != owner {
		return false
	}
	count := int(n.Units * fraction)
	if count < 1 {
		return false
	}
	n.Units -= float64(count)
	t := g.Nodes[to]
	duration := math.Hypot(n.X-t.X, n.Y-t.Y) / 105
	g.Fleets = append(g.Fleets, Fleet{From: from, To: to, Owner: owner, Units: count, Duration: duration})
	if owner == 1 {
		g.Sent += count
	}
	return true
}
func (g *Game) Upgrade(id, owner int) bool {
	if g.Status != "playing" || id < 0 || id >= len(g.Nodes) {
		return false
	}
	n := &g.Nodes[id]
	cost := float64(n.Level * 20)
	if n.Owner != owner || n.Level >= 3 || n.Units < cost {
		return false
	}
	n.Units -= cost
	n.Level++
	return true
}
func (g *Game) Step(dt float64) {
	if g.Status != "playing" || dt <= 0 {
		return
	}
	dt = math.Min(dt, .25)
	g.Time += dt
	for i := range g.Nodes {
		n := &g.Nodes[i]
		if n.Owner != 0 {
			rate := 1.35
			if n.Owner == 2 {
				if g.Difficulty == "easy" {
					rate = 1.0
				}
				if g.Difficulty == "hard" {
					rate = 1.65
				}
			}
			n.Units = math.Min(250, n.Units+dt*rate*float64(n.Level))
		}
	}
	remaining := g.Fleets[:0]
	for _, f := range g.Fleets {
		f.Progress += dt / f.Duration
		if f.Progress < 1 {
			remaining = append(remaining, f)
			continue
		}
		n := &g.Nodes[f.To]
		if n.Owner == f.Owner {
			n.Units += float64(f.Units)
		} else {
			n.Units -= float64(f.Units)
			if n.Units < 0 {
				n.Units = -n.Units
				n.Owner = f.Owner
				if f.Owner == 1 {
					g.Captures++
				}
			}
		}
	}
	g.Fleets = remaining
	g.botClock += dt
	interval := 2.4
	if g.Difficulty == "easy" {
		interval = 4.2
	}
	if g.Difficulty == "hard" {
		interval = 1.4
	}
	if g.botClock >= interval {
		g.botClock = 0
		g.bot()
	}
	alive := [3]bool{}
	for _, n := range g.Nodes {
		alive[n.Owner] = true
	}
	for _, f := range g.Fleets {
		alive[f.Owner] = true
	}
	if !alive[1] {
		g.Status = "defeat"
	} else if !alive[2] {
		g.Status = "victory"
	} else if g.Time >= 300-1e-7 {
		g.Time = 300
		a, b := 0., 0.
		for _, n := range g.Nodes {
			if n.Owner == 1 {
				a += n.Units + 60*float64(n.Level)
			}
			if n.Owner == 2 {
				b += n.Units + 60*float64(n.Level)
			}
		}
		for _, f := range g.Fleets {
			if f.Owner == 1 {
				a += float64(f.Units)
			} else {
				b += float64(f.Units)
			}
		}
		if a > b {
			g.Status = "victory"
		} else if b > a {
			g.Status = "defeat"
		} else {
			g.Status = "draw"
		}
	}
}
func (g *Game) bot() {
	for i := range g.Nodes {
		n := g.Nodes[i]
		if n.Owner != 2 || n.Units < 14 {
			continue
		}
		best := -1
		score := math.MaxFloat64
		for j, t := range g.Nodes {
			if t.Owner == 2 {
				continue
			}
			d := math.Hypot(n.X-t.X, n.Y-t.Y)
			s := t.Units*3 + d*.075
			if t.Owner == 1 {
				s -= 8
			}
			if s < score && n.Units*.72 > t.Units+3 {
				score = s
				best = j
			}
		}
		if best >= 0 {
			g.Send(i, best, 2, .75)
		} else if n.Units > 65 && n.Level < 3 {
			g.Upgrade(i, 2)
		}
	}
}
