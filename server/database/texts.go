package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	Path string
}

type Text struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

func (d *Database) GetTexts() ([]Text, error) {
	texts := []Text{}

	db, err := sql.Open("sqlite3", d.Path)
	if err != nil {
		log.Printf("Failed to open DB, err: %v", err)
		return texts, err
	}
	defer db.Close()

	sqlStmt := `
	SELECT id, title, content
	FROM texts
	LIMIT 10;
	`

	rows, err := db.Query(sqlStmt)
	if err != nil {
		if err != nil {
			log.Printf("Failed to query DB, err: %v", err)
			return texts, err
		}
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var title string
		var content string
		err = rows.Scan(&id, &title, &content)
		if err != nil {
			log.Printf("Failed to scan row, err: %v", err)
			return texts, err
		}
		texts = append(texts, Text{
			id,
			title,
			content,
		})
	}
	err = rows.Err()
	if err != nil {
		log.Printf("Failed in iteration, err: %v", err)
		return texts, err
	}

	return texts, err
}
