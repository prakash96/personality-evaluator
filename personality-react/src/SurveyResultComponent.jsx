import React, { Component } from "react";


import * as Survey from "survey-react";
import Chart from 'react-google-charts';
import { Section, Prop } from "./generic";
import LoaderComponent from "./LoaderComponent";
Survey.StylesManager.applyTheme("modern");

class SurveyResultComponent extends Component {

    RESULT_ENDPOINT = "https://personality-evaluator-eapi.us-e2.cloudhub.io/api/report/";
    texts = {
        "1": "In this quadrant, an individual uses high enthusiasm and is low on understanding. His primary objective is to be in control in most of the situations and conversations with others. In order to achieve their objective, they may consciously or unconsciously tread on others rights or feelings. Such individuals may fail to listen to others or may regularly interrupt them. They may take a very direct and commanding approach by using strong body language and a loud confident voice.",
        "2": "In this quadrant, the individual tends to use low enthusiasm and low understanding levels. Such an individual normally keeps to himself or remains quiet and unassuming in most discussions or in meetings with others. They may not feel the need to join others in discussions and may silently watch the ‘antics’ of others. When directly engaged, this style is likely to often give way or concede to more aggressive types but to mentally analyze how they might redress the balance in a different way in the future.",
        "3": "In this quadrant, the individual uses high understanding and low enthusiasm. He tends to offer gentle comments and suggestions in discussions and conversations. He is more interested in finding out about other people and in building better relationships. Such individuals avoid jeopardizing a positive conversational climate to push even their important points too hard. They may therefore accept that they may not get everything they seek in a discussion but there is always the next time.",
        "4": "In this quadrant, an individual uses high enthusiasm and high understanding. Such individuals normally have high feeling of self-esteem and are aware of their personal needs and rights. At the same time, they are also sensitive to others needs and rights. An individual adopting this style will first listen to others attentively before firmly communicating their message. This style is also likely to have strong personal standards and they act to ensure that these are compromised as little as possible."
    };

    proscons = {
    "1":`Possible Body Language: Invades space, loud voice, arms crossed or moving aggressively, very direct eye contact or even staring.
Strengths:
Confident and commanding when required.
Weakness:
May often be insensitive to others rights and needs.
May adopt a sarcastic or hostile attitude.
Interrupts or talks over others without listening.`,
        "2": `Possible Body Language: Leaning back, hands clasped or arms crossed, eyes averted or watching the broad scene with fleeting looks and possible sighs.

Strengths:
Effectively analyzes discussions or debates.
Can listen effectively.
Weakness:

Ignores/sacrifices own rights.
Stays silent rather than speaking up.
Can feel inept at times.`,
        "3": `Possible Body Language: Open posture, good eye contact, friendly, smiling, some use of hands when speaking and concentrating, so as to listen properly.

Strengths:
Keeps the discussions and conversations calm and friendly.
Gently offers a lot of ideas and suggestions.
Weakness:
May not come to the point about what they need or want.
May become upset in the face of high aggression or anger.`,
        "4": `Possible Body Language: Relaxed, slightly leaning forward posture and lots of use of the hands, good eye contact and confident, usually modulated voice.

Strengths:

Takes action towards achieving the result without denying others rights.
Pro-active and solution oriented to always find a positive way forward.
Demonstrates that he / she value the feelings and needs of others.
Listens effectively.
Weakness:
May not coach others who are less assertive.`
    };

    constructor(props) {
        super(props);
        this.state = {
            assertiveText: "", prosconsText: "", data: [['Assertive Profile', 'Score']]
        };
    }


    invokeResultAPI(uuid) {
        fetch(this.RESULT_ENDPOINT + uuid)
            .then(res => res.json())
            .then(
                (response) => {
                    let aggresiveScore = response.Aggresive;
                    let passiveScore = response.Passive;
                    let receptiveScore = response.Receptive;
                    let assertiveScore = response.Assertive;
                    
                    
                    let result = [{ "id": "1", "text": "Aggresive", "score": aggresiveScore }, { "id": "2", "text": "Passive", "score": passiveScore }, { "id": "3", "text": "Receptive", "score": receptiveScore }, { "id": "4", "text": "Assertive", "score": assertiveScore }];
                    this.state.data = [
                        ['Attribute', 'Score']];
        
                    let maxIndex = 0, max = result[0].score;
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].score > max) {
                            max = result[i].score;
                            maxIndex = i;
                        }
                        this.state.data.push([result[i].text, result[i].score]);
                    }
                    
                    document.querySelector("#survey-result-loader").style.display = "none";
                    document.querySelector("#survey-result-content").style.display = "block";
                    this.onclickRowItem(maxIndex+1);


                },

                (error) => {
                    console.error(error);
                }
            );
    }

    componentDidMount() {
        let uuid = new URLSearchParams(window.location.search).get("uuid");
        if (!uuid) {
            window.location.href = "/survey";
        }

        document.querySelector("#survey-result-loader").style.display = "block";
        document.querySelector("#survey-result-content").style.display = "none";

        this.invokeResultAPI(uuid);
    }

    onclickRowItem(index) {
        this.state.assertiveText = this.texts[index];
            this.state.prosconsText = this.proscons[index];
            this.setState(this.state);
    }

    render() {
        return (
            <div>
                <div id="survey-result-loader">

                    <LoaderComponent />
                </div>
                <div id="survey-result-content">
                    <div className="row d-flex justify-content-center" style={{ padding: "10px" }}>
                        <div className="col-sm-4">
                            <Chart
                                width={'100%'}
                                height={'100%'}
                                chartType="Table"
                                loader={<div>Loading Chart</div>}
                                data={this.state.data}
                                formatters={[
                                    {
                                        type: 'BarFormat',
                                        column: 1,
                                        options: {
                                            width: 120,
                                        },
                                    },
                                ]}
                                options={{
                                    allowHtml: true,
                                    showRowNumber: false,
                                    width: '100%',
                                    height: '100%',
                                }}
                                chartEvents={[
                                    {
                                        eventName: "ready",
                                        callback: ({ chartWrapper, google }) => {
                                            const chart = chartWrapper.getChart();

                                            chart.container.querySelector("table").addEventListener("click", (ev) => this.onclickRowItem(ev.target.parentElement.rowIndex));

                                        }
                                    }
                                ]}
                                rootProps={{ 'data-testid': '2' }}
                            />
                        </div>
                        <div className="col-sm-5" >

                            <Section className="rounded-right rounded-left" style={{
                                width: "100vw",
                                height: "100vh",
                                padding: "10px",
                                background: "rgb(53, 126, 221)",

                            }}>
                                <Prop>{this.state.assertiveText}</Prop>

                            </Section>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center" style={{ padding: "10px" }}>
                        

                        <div className="col-sm-9" >

                            <Section className="rounded-right rounded-left" style={{
                                width: "100vw",
                                height: "100vh",
                                padding: "10px",
                                background: "rgba(26,188,156,.9)",

                            }}>
                                <pre>{this.state.prosconsText}</pre>

                            </Section>
                        </div>
                    </div>
                </div>

            </div>
        );
    }


}

export default SurveyResultComponent;
