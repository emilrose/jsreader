package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/emilrose/jsreader/server/database"
)

func main() {
	args := os.Args[1:]
	if len(args) != 1 {
		fmt.Printf("Expected one arg for DB, got args %v\n", args)
		os.Exit(1)
	}
	db := database.Database{Path: args[0]}

	http.HandleFunc("/reader/texts/", func(w http.ResponseWriter, r *http.Request) {
		texts, err := db.GetTexts()
		if err != nil {
			http.Error(w, "error getting texts", http.StatusInternalServerError)
		}

		responseJson, err := json.Marshal(texts)
		if err != nil {
			http.Error(w, "error marshalling json", http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(responseJson)
	})

	http.ListenAndServe(":4000", nil)
}
