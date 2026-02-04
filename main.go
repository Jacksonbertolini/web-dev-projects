package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Athlete struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Grade          int    `json:"grade"`
	PersonalRecord string `json:"personalRecord"`
}

var athletes = []Athlete{
	{ID: 1, Name: "Sarah Johnson", Grade: 11, PersonalRecord: "18:45"},
	{ID: 2, Name: "Mike Chen", Grade: 10, PersonalRecord: "17:32"},
	{ID: 3, Name: "Emma Williams", Grade: 12, PersonalRecord: "19:15"},
	{ID: 4, Name: "James Rodriguez", Grade: 9, PersonalRecord: "20:08"},
}

type Meet struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

var meets = []Meet{
	{ID: 1, Name: "County Championship", Date: "2026-03-15", Location: "Jones County Park"},
	{ID: 2, Name: "Regional Invitational", Date: "2026-03-22", Location: "Riverside Stadium"},
	{ID: 3, Name: "State Qualifier", Date: "2026-04-05", Location: "Capital City Course"},
}

type Result struct {
	ID        int    `json:"id"`
	AthleteID int    `json:"athleteId"`
	MeetID    int    `json:"meetId"`
	Time      string `json:"time"`
	Place     int    `json:"place"`
}

var results = []Result{
	{ID: 1, AthleteID: 1, MeetID: 1, Time: "19:02", Place: 3},
	{ID: 2, AthleteID: 2, MeetID: 1, Time: "17:45", Place: 1},
	{ID: 3, AthleteID: 3, MeetID: 1, Time: "19:30", Place: 5},
	{ID: 4, AthleteID: 4, MeetID: 1, Time: "20:15", Place: 8},
	{ID: 5, AthleteID: 1, MeetID: 2, Time: "18:50", Place: 2},
	{ID: 6, AthleteID: 2, MeetID: 2, Time: "17:38", Place: 1},
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost:5174"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type"},
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello from Gin!",
		})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
		})
	})

	r.GET("/api/athletes", func(c *gin.Context) {
		c.JSON(http.StatusOK, athletes)
	})

	r.GET("/api/meets", func(c *gin.Context) {
		c.JSON(http.StatusOK, meets)
	})

	r.GET("/api/results", func(c *gin.Context) {
		c.JSON(http.StatusOK, results)
	})

	r.Run(":8080")
}
