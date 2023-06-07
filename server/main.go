package main

import (
	"fmt"
	"net/http"
)

func main() {

	http.HandleFunc("/reader/hello/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello")
	})

	http.ListenAndServe(":4000", nil)
}