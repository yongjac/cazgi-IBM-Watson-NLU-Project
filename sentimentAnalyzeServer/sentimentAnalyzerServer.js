const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

function analyze(documentToAnalyze, analyzeParams, feature, res) {
    let naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        let result;
        if(feature === "sentiment") {
            result = analysisResults.result.sentiment.document.label;
        } else {
            result = analysisResults.result.emotion.document.emotion;
        }
        res.send(result);
    })
    .catch(err => {
        res.send(err.toString());
    });
}

app.get("/",(req,res)=>{
    res.render('index.html');
});

app.get("/url/emotion", (req,res) => {
    let url = req.query.url;

    const analyzeParams = {
        'url': url,
        'features': {
            'emotion': {}
        }
    };

    analyze(url, analyzeParams, "emotion", res);
});

app.get("/url/sentiment", (req,res) => {
    let url = req.query.url;

    const analyzeParams = {
        'url': url,
        'features': {
            'sentiment': {}
        }
    };

    analyze(url, analyzeParams, "sentiment", res);
});

app.get("/text/emotion", (req,res) => {
    let text = req.query.text;

    const analyzeParams = {
        'text': text,
        'features': {
            'emotion': {}
        }
    };

    analyze(text, analyzeParams, "emotion", res);
});

app.get("/text/sentiment", (req,res) => {
    let text = req.query.text;

    const analyzeParams = {
        'text': text,
        'features': {
            'sentiment': {}
        }
    };

    analyze(text, analyzeParams, "sentiment", res);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

