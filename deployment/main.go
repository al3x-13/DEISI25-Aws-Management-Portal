package main

import (
	"crypto/rand"
	"embed"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/charmbracelet/huh"
	"golang.org/x/crypto/bcrypt"
)

var (
	jwtSecret        string
	awsRegion        string
	awsAccessKey     string
	awsSecretKey     string
	dbUsername       string = "admin"
	dbPassword       string
	stdUserUsername  string = "testuser"
	stdUserPassword  string
	rootUserUsername string = "root"
	rootUserPassword string
	//go:embed utils/dev-db.sql
	sqlFile embed.FS
)

func GenerateRandomHexString(len int) (string, error) {
	bytes := make([]byte, len)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func GenerateBackendEnvFile(jwtSec string, awsReg string, awsAccKeyId string, awsSec string, dbUser string, dbPw string) error {
	filename := ".env.backend"

	file, err := os.Create(filename)
	if err != nil {
		log.Fatal("Error creating backend .env file")
		return err
	}
	defer file.Close()

	file.WriteString("NODE_ENV=production\n")
	file.WriteString("DB_URL=postgres://" + dbUser + ":" + dbPw + "@localhost:5432/dev-db\n")
	file.WriteString("JWT_SECRET=" + jwtSec + "\n")
	file.WriteString("AWS_ACCESS_KEY_ID=" + awsAccKeyId + "\n")
	file.WriteString("AWS_SECRET_ACCESS_KEY=" + awsSec + "\n")
	file.WriteString("AWS_DEFAULT_REGION=" + awsReg)
	fmt.Println("Backend env file created successfully")
	return nil
}

func GenerateDbEnvFile() error {
	filename := ".env.db"

	file, err := os.Create(filename)
	if err != nil {
		log.Fatal("Error creating db .env file")
		return err
	}
	defer file.Close()

	file.WriteString("POSTGRES_DB=dev-db\n")
	file.WriteString("POSTGRES_USER=" + dbUsername + "\n")
	file.WriteString("POSTGRES_PASSWORD=" + dbPassword + "\n")

	fmt.Println("DB env file created successfully")
	return nil
}

func UpdateSqlFileWithUserCredentials(data []byte) []string {
	var stdUserHash []byte
	var rootUserHash []byte

	stdUserHash, _ = bcrypt.GenerateFromPassword([]byte(stdUserPassword), 10)
	rootUserHash, _ = bcrypt.GenerateFromPassword([]byte(rootUserPassword), 10)

	content := strings.Split(string(data), "\n")
	for i, line := range content {
		if strings.Contains(line, "root@deisi25.tfc") {
			lineContent := strings.Split(line, "\t")
			lineContent[2] = string(rootUserHash)
			content[i] = strings.Join(lineContent, "\t")
		}

		if strings.Contains(line, "john@deisi25.tfc") {
			lineContent := strings.Split(line, "\t")
			lineContent[1] = "testuser"
			lineContent[2] = string(stdUserHash)
			lineContent[3] = "testuser@deisi25.tfc"
			content[i] = strings.Join(lineContent, "\t")
		}
	}

	fmt.Println("SQL file generated successfully")
	return content
}

func GenerateSettingsInfoFile() error {
	filename := "env-settings.txt"

	file, err := os.Create(filename)
	if err != nil {
		log.Fatal("Error creating env settings file")
		return err
	}
	defer file.Close()

	file.WriteString("### AWS Settings ###\n")
	file.WriteString("AWS region: " + awsRegion + "\n")
	file.WriteString("AWS Access Key ID: " + awsAccessKey + "\n")
	file.WriteString("AWS Secret Key: " + awsSecretKey + "\n")

	file.WriteString("\n### DB Settings ###\n")
	file.WriteString("DB name: dev-db\n")
	file.WriteString("DB username: " + dbUsername + "\n")
	file.WriteString("DB password: " + dbPassword + "\n")

	file.WriteString("\n### USER Info ###\n")
	file.WriteString("ROOT User\n")
	file.WriteString("Username: " + rootUserUsername + "\n")
	file.WriteString("Password: " + rootUserPassword + "\n")
	file.WriteString("\nSTANDARD User\n")
	file.WriteString("Username: " + stdUserUsername + "\n")
	file.WriteString("Password: " + stdUserPassword + "\n")

	fmt.Println("Settings info file created succesfully")
	return nil
}

func main() {
	var err error

	data, err := sqlFile.ReadFile("utils/dev-db.sql")
	if err != nil {
		panic(err)
	}

	jwtSecret, err = GenerateRandomHexString(64)
	if err != nil {
		log.Fatal(err)
		return
	}

	dbPassword, err = GenerateRandomHexString(15)
	if err != nil {
		log.Fatal(err)
		return
	}

	form := huh.NewForm(
		huh.NewGroup(
			// AWS region
			huh.NewSelect[string]().
				Title("Choose and AWS region").
				Options(
					huh.NewOption("Europe (Ireland)", "eu-west-1"),
					huh.NewOption("Europe (London)", "eu-west-2"),
					huh.NewOption("Europe (Paris)", "eu-west-3"),
					huh.NewOption("Europe (Frankfurt)", "eu-central-1"),
					huh.NewOption("Europe (Stockholm)", "eu-north-1"),
				).
				Value(&awsRegion),

			// AWS Access Key
			huh.NewInput().
				Title("Insert you AWS Access Key ID").
				Prompt("# ").
				Value(&awsAccessKey),

			// AWS Secret Key
			huh.NewInput().
				Title("Insert your AWS Secret Key").
				Prompt("# ").
				Value(&awsSecretKey),
		),

		huh.NewGroup(
			huh.NewInput().
				Title("Insert a password for the ROOT user").
				Prompt("# ").
				Value(&rootUserPassword),
		),

		huh.NewGroup(
			huh.NewInput().
				Title("Insert the password for the STANDARD user").
				Prompt("# ").
				Value(&stdUserPassword),
		),
	)

	err = form.Run()
	if err != nil {
		log.Fatal(err)
	}

	// Generate backend .env file
	err = GenerateBackendEnvFile(jwtSecret, awsRegion, awsAccessKey, awsSecretKey, dbUsername, dbPassword)
	if err != nil {
		log.Fatal("Failed to create backend env file")
		return
	}

	// Generate db .env file
	err = GenerateDbEnvFile()
	if err != nil {
		log.Fatal("Failed to create db env file")
		return
	}

	// Build SQL file
	updatedSql := UpdateSqlFileWithUserCredentials(data)
	updatedSqlStr := strings.Join(updatedSql, "\n")
	err = os.WriteFile("dev-db.sql", []byte(updatedSqlStr), 0644)
	if err != nil {
		log.Fatal("Failed to generate SQL file")
		return
	}

	err = GenerateSettingsInfoFile()
	if err != nil {
		log.Fatal("Failed to create setting info file")
		return
	}

	fmt.Println("ALL ENVIRONMENT FILES CREATED SUCCESFULLY")
}
