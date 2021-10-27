import React from "react";
import ReactLoading from "react-loading";
import { Section, Title, Article, Prop, list } from "./generic";

const Loader = () => (
  <Section style= {{
    width: "100vw",
    height: "100vh",
    background: "rgb(53, 126, 221)",
    paddingTop: "20px"
  }}>
    <Title>please wait..</Title>
    {list.map(l => (
      <Article key={l.prop}>
        <ReactLoading type={l.prop} color="#fff" />
       
     
      </Article>
    ))}
  </Section>
);

export default Loader;