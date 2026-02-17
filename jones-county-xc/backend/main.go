package main

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"jones-county-xc/backend/db"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var queries *db.Queries

func main() {
	// Connect to MySQL
	// For production, use environment variables instead of hardcoded credentials
	dsn := "xc_app:xc_password@tcp(localhost:3306)/jones_county_xc?parseTime=true"
	database, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()

	// Verify connection
	if err := database.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Connected to MySQL database")

	// Initialize sqlc queries
	queries = db.New(database)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173", "http://localhost:5174", "https://jackson-web-dev.duckdns.org"},
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

	// Athletes endpoints
	r.GET("/api/athletes", listAthletes)
	r.GET("/api/athletes/:id", getAthlete)

	// Results endpoints
	r.GET("/api/results", listResults)

	// Meets endpoints
	r.GET("/api/meets", listMeets)
	r.GET("/api/meets/:id/results", getMeetResults)

	r.Run(":8080")
}

func listAthletes(c *gin.Context) {
	athletes, err := queries.ListAthletes(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, athletes)
}

func getAthlete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid athlete id"})
		return
	}

	athlete, err := queries.GetAthlete(c.Request.Context(), int32(id))
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "athlete not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, athlete)
}

func listResults(c *gin.Context) {
	results, err := queries.ListResults(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}

func listMeets(c *gin.Context) {
	meets, err := queries.ListMeets(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, meets)
}

func getMeetResults(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid meet id"})
		return
	}

	results, err := queries.GetResultsByMeet(c.Request.Context(), int32(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}
