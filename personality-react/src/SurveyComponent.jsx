import { queryByDisplayValue } from "@testing-library/dom";
import React, { Component } from "react";
import { ServerStyleSheet } from "styled-components";


import * as Survey from "survey-react";



import "survey-react/modern.css";
import "./index.css";
import LoaderComponent from "./LoaderComponent"

Survey.StylesManager.applyTheme("modern");

class SurveyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { json: {} };
    }
    QUESTIONS_API = "http://personality-evaluator-eapi.us-e2.cloudhub.io/api/questions";
    ANSWERS_ENDPOINT = "http://personality-evaluator-eapi.us-e2.cloudhub.io/api/answers";
    
    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    
    async postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response; 
    }

    render() {

        let survey = new Survey.Model(this.state.json);

        let that = this;
        survey.onComplete
            .add(function (sender) {
                setTimeout(() => {
                    let response = sender.data;
                    let answersValues = Object.values(response.questionaire);

                    let responses = [];
                    for (let i = 0; i < answersValues.length; i++) {
                        responses.push({ questionId: (i + 1), response: answersValues[i] });
                    }

                    let payload = { name: response.name, age: 0, email: response.email, responses: responses };


                    that.postData(that.ANSWERS_ENDPOINT, payload)
                        .then(resp => resp.text()).then(data => {
                            console.log(data);
                            let uuid = data.replace('"', '').split(" ")[0];
                            window.location.href = "/survey-result?uuid=" + uuid;
                    });

                    
                }, 100);

                document.querySelector("#survey-loader").style.display = "block";
                document.querySelector("#survey-content").style.display = "none";

            });
        return (
            <div>
                <div id="survey-loader">

                    <LoaderComponent />
                </div>
                <div id="survey-content" >
                    <Survey.Survey
                        model={survey}
                    />
                </div>

            </div>
        );
    }

    invokeQuestionsAPI(json) {
        fetch(this.QUESTIONS_API)
            .then(res => res.json())
            .then(
                (result) => {
                    let rows = [];
                    for (let i = 0; i < result.length; i++) {
                        rows.push({ value: result[i].QID, text: result[i].TEXT });
                    }

                    json.questions[0].rows = rows;
                    document.querySelector("#survey-loader").style.display = "none";
                    document.querySelector("#survey-content").style.display = "block";

                    this.setState({ "json": json });


                },

                (error) => {
                    console.error(error);
                }
            );
    }
    componentDidMount() {


        let json = {
            questions: [
                {
                    type: "matrix", name: "questionaire", isAllRowRequired: true, title: "AA - Almost Always,     MT - Most of the Time,      ST - Some of the Time, OC - Occassionality, AN - Almost Never", questionTitleLocation: "hidden",
                    columns: [{ value: 2, text: "AA" },
                    { value: 1, text: "MT" },
                    { value: 0, text: "ST" },
                    { value: -1, text: "OC" },
                    { value: -2, text: "AN" }],
                    rows: []
                },
                {
                    type: "text",
                    name: "name",
                    title: "Please enter your name. Your name will be displayed to other members matching with your personality.",

                    isRequired: true
                }, {
                    type: "text",
                    name: "email",
                    inputType: "email",
                    title: "Please enter your email address if you prefer to expose your email to community"
                }
            ]
        };

        this.invokeQuestionsAPI(json);



    }
}

export default SurveyComponent;
