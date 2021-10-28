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

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    render() {

        let survey = new Survey.Model(this.state.json);

        let that = this;
        survey.onComplete
            .add(function (sender) {
                setTimeout(() => {
                    let uuid = that.uuidv4();
                    sessionStorage.setItem(uuid, JSON.stringify(sender.data));
                    window.location.href = "/survey-result?uuid=" + uuid;
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

    invokeQuestionsAPI(){
        fetch(this.QUESTIONS_API)
        .then(res => res.json())
        .then(
            (result) => {
               console.log(result);    
            },

            (error) => {
                console.error(error);
            }
        );
    }
    componentDidMount() {
        setTimeout(() => {
            let rows = [{ value: 1, text: "When I disagree with an opinion expressed by others, I openly express my disagreement." },
            { value: 2, text: "I prefer taking the blame for something rather than making an excuse." },
            { value: 3, text: "If people are pleasant and friendly, I gently address the issues that are important to me." },
            { value: 4, text: "I can comfortably decline offers from even very influential sales people." },
            { value: 5, text: "Sometimes I get involved in confrontations with others that remain unresolved." },
            { value: 6, text: "I avoid questioning or approaching people when they jump in a queue." },
            { value: 7, text: "I can shower affection and accept the same from others without inhibition." },
            { value: 8, text: "I don’t mind asking colleagues and friends for favours." },
            { value: 9, text: "I strongly persist to get my ideas heard and acted upon." },
            { value: 10, text: "I believe that the humble will inherit the earth." },
            { value: 11, text: "I tend to empathize with all the people that I encounter." },
            { value: 12, text: "I keep my cool and remain composed even when faced with aggressive outbursts." },
            { value: 13, text: "Given a sufficient reason, I will publicly criticize and admonish people." },
            { value: 14, text: "I tend to stay silent and simply listen and watch when someone is angry." },
            { value: 15, text: "I like to wait for a good moment to get my message across properly." },
            { value: 16, text: "If someone owes me money, I give him a friendly reminder." },
            { value: 17, text: "I sometimes try to stare people down." },
            { value: 18, text: "When people put pressure on me, I manage to stay calm and unemotional." },
            { value: 19, text: "I am relaxed and easy going in dealing with people." },
            { value: 20, text: "I openly and comfortably acknowledge that others may have different opinions from mine." },
            { value: 21, text: "I often interrupt people to get my point across to them." },
            { value: 22, text: "I often find myself reflecting mentally on other people’s words or behaviour." },
            { value: 23, text: "I give and receive a lot of information when socializing." },
            { value: 24, text: "I normally do not accept poor service from others." },
            { value: 25, text: "I prefer speaking my mind irrespective of the risk involved." },
            { value: 26, text: "I rarely make a fuss even if I know I am being manipulated." },
            { value: 27, text: "I build quality relationship with people to ensure that they listen effectively." },
            { value: 28, text: "I don’t feel guilty or inept while accepting any mistakes made by me." },
            { value: 29, text: "I can get irritated or lose my temper when others criticize me." },
            { value: 30, text: "I like watching the actions of other people when they get excited or highly animated." },
            { value: 31, text: "While influencing another person, I tend to use the words that will appeal him." },
            { value: 32, text: "I tell people my rights and personal expectations when necessary." }];

           
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

            json.questions[0].rows = rows;
            document.querySelector("#survey-loader").style.display = "none";
            document.querySelector("#survey-content").style.display = "block";

            this.setState({ "json": json });

        }, 3000);

    }
}

export default SurveyComponent;
