package main

import (
	"flag"
	"log"
	"mime"
	"net/http"
	"time"
)

func main() {
	addr := flag.String("addr", ":8080", "listen address")
	dir := flag.String("dir", "dist", "web assets")
	flag.Parse()
	_ = mime.AddExtensionType(".mjs", "text/javascript; charset=utf-8")
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir(*dir)))
	server := &http.Server{Addr: *addr, Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	log.Printf("GAMAT ready at http://localhost%s", *addr)
	log.Fatal(server.ListenAndServe())
}
