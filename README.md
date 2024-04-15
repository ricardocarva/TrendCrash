# TrendCrash: Accident Data Complex Trend Explorer 🚗💥📊

## Table of Contents 📑

1. [Description](#Description-) 📝
2. [Introduction to the Database Conceptual Design](#Introduction-to-the-Database-Conceptual-Design-%EF%B8%8F) 🏗️
3. [Setting Up](#Setting-Up-) 🔧
4. [Run the Application](#Run-the-Application-) 🚀
5. [To Install Docker in Debian/Ubuntu Systems](#To-Install-Docker-in-Debian/Ubuntu-Systems-) 🐧

## Description 📝

The project serves as a centralized hub 🎯 for accessing and analyzing detailed information regarding traffic accidents across the United States 🇺🇸. Our application is built upon a robust dataset sourced from Kaggle, encompassing approximately 7.7 million records of accidents recorded over a seven-year period, and we've integrated additional datasets to enrich the analytical capabilities of our platform. These supplementary datasets include information on road conditions, COVID-19 driving tips, unemployment rates, and the Consumer Price Index, spanning multiple years to provide a holistic view of factors influencing traffic safety.

The primary goal is to empower users with the ability to extract meaningful insights from this vast repository of accident data 📈.

## Introduction to the Database Conceptual Design 🏗️

The conceptual database design aims to create a comprehensive database that integrates traffic accidents, road conditions, COVID-19 related transportation statistics, unemployment data, and Consumer Price Index (CPI) metrics. The database will support complex queries to analyze the impact of various factors on traffic accidents across the United States from 2016 to 2023.

### Description of Data Sources 🗃️

#### US Accidents 🚑

The primary data source, containing detailed records of traffic accidents, sourced from Traffic APIs and official entities. The data source was downloaded from Kaggle. The attributes include accident severity, location, time, weather conditions, Points of Interest (POIs), and more dates. It contains data from 2016 to 2023.

#### Road Conditions Dataset 🛣️

The dataset was obtained from the Bureau of Transportation Statistics. The dataset provides data on road conditions using the International Roughness Index (IRI) for all states, spanning from 1994 to 2020. The metric is a score that describes how much total vertical movement a standard passenger vehicle would experience if driven over a segment of the road. The higher the IRI value, the worse the quality of the pavement.

#### COVID-19 Dataset 😷

The dataset was obtained from the Bureau of Transportation Statistics. It contains a count of trips by distance measured in daily average by month. It contains transportation statistics to analyze the pandemic's impact on travel and accidents, sourced from mobile device data. A trip, in this context, is defined as a movement that includes a stay over 10 minutes at a location away from home. It contains data from 2019 to 2024.

#### Unemployment Dataset 💼

A comprehensive dataset of Labor Force Statistics provided by the US Bureau of Labor, including unemployment rates by state and county from 1976 to 2022. We reduced the data span from 2016 to 2022 as these are the years we are interested in for our queries.

#### Consumer Price Index Dataset 💹

The State-level Consumer Price Index is a dataset sourced from the Bureau of Labor Statistics. The dataset provides state-level CPI data from 2004 to 2024, indicating the average price change of a fixed set of goods and services. The data includes columns for months, years, and regions. We reduced the data span from 2016 to 2023 as these are the years we are interested in for our queries.

## Setting Up 🔧

Ensure you have node.js on version 14.6 at least:

```
node -v
```

Create a file named 'config.env' in the config directory with the content:

```
PORT = 3000
DB_CONFIG_USERNAME = "<YOUR USERNAME>"
DB_CONFIG_PASSWORD = "<YOUR CISE PASSWORD>"
DB_CONFIG_CONNECTION = "oracle.cise.ufl.edu:1521/orcl"
```

Get your db credentials from: https://register.cise.ufl.edu/oracle/

## Run the Application 🚀

1. To run it, open the directory and run:

```
docker-compose up -d
```

2. To stop the container, run:

```
docker-compose down
```

3. Access the website at:

   - http://localhost:3000/data

4. When making changes, run:

```
docker-compose up --build
```

## To Install Docker in Debian/Ubuntu Systems 🐧

1. Ensure that pip is installed on your system.

```
sudo apt-get update
sudo apt-get install python3-pip
```

2. Install Docker Compose:

```
pip install docker-compose
```

3. Verify the installation

```
docker-compose --version
```

# Happy data exploring! 🧐📈
