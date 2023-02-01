import classes from "./PageContent.module.css";

function PageContent(props){
    return (
        <div className={classes.pageLayout}>
        <h1>{props.title}</h1>
        {props.children}
        </div>
    );
}

export default PageContent;