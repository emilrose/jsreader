package main

import (
	"encoding/json"
	"jsreader/database"
	"net/http"
)

func main() {
	http.HandleFunc("/reader/texts/", func(w http.ResponseWriter, r *http.Request) {
		texts, err := database.GetTexts()
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
