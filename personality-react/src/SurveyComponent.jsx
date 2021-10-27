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
        this.state = {json: {}};
      }

    
    

    render() {

        let survey = new Survey.Model(this.state.json);
        survey.onComplete
        .add(function (sender) {
            setTimeout(() => {
                window.location.href = "/survey-result?uuid=4340348390";
            }, 3000);

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

    componentDidMount() {
        setTimeout(() => {
            let json = {
                questions: [{
                    type: "text",
                    name: "name",
                    title: "Please enter your name. Your name will be displayed to other members matching with your personality.",

                    isRequired: true
                }, {
                    type: "text",
                    name: "email",
                    inputType: "email",
                    title: "Please enter your email address if you prefer to expose your email to community",

                },
                {
                    type: "matrix", name: "Description", isAllRowRequired: true, title: "AA - Almost Always,     MT - Most of the Time,      ST - Some of the Time, OC - Occassionality, AN - Almost Never", questionTitleLocation: "hidden",
                    columns: [{ value: 1, text: "AA" },
                    { value: 2, text: "MT" },
                    { value: 3, text: "ST" },
                    { value: 4, text: "OC" },
                    { value: 5, text: "AN" }],
                    rows: [{ value: "1", text: "When I disagree with an opinion expressed by others, I openly express my disagreement." },
                    { value: "2", text: "I prefer taking a blame for something rather than making an excuse." },
                    ]
                }
                ]
            };
            document.querySelector("#survey-loader").style.display = "none";
            document.querySelector("#survey-content").style.display = "block";
            
            this.setState({"json": json});
           
        }, 3000);
       
    }
}

export default SurveyComponent;
