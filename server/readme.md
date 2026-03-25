# Setup

⚠️ Note: Do not forget to add the .env file in the /server folder before running the project. I have shared it on Email.

Clone the repository:

```bash
git clone https://github.com/rammewada/review-and-rate.git
cd server
npm install
npm run dev

```

# API DOCUMENTAION

## Company

#### 1. Create Company

```javascript

POST localhost:4000/api/company

body : {
name:""
address:""
city:""
logo: file ,
foundedYear: date e.g. 12-01-2025
}

```

#### 2. Get All Companies

```javascript
GET localhost:4000/api/company

query params :

search : city name | company name | address
sort : createdAt | ratingsAverage
order : asc | desc
page : number
limit : number
city : string
minRating : number
topRated : boolean
```

#### 3. Get Single Company

```javascript

GET localhost:4000/api/company/:id

```

### 4. Delete One

```javascript

DELETE localhost:4000/api/company/:id

```

## Review

#### 1. Create Review

```javascript

POST localhost:4000/api/review

body : {
name: string
company:"company id",
rating: number e.g. 5,
content:"review text"
}

```

#### 2. Get All Reviews

```

GET localhost:4000/api/review

```

#### 3. Get Single Review

```javascript

GET localhost:4000/api/review/:id

```

### 4. Delete One

```javascript

DELETE localhost:4000/api/review/:id

```
