import MainNavigation from "./MainNavigation";
import PageContent from "./PageContent";
import { useRouteError } from "react-router-dom";

function ErrorPage(){
    const error = useRouteError();

    let title = "Error Occured";
    let message = "Something went wrong";

    if(error.status === 500){
        message = error.data.message;
    }

    if(error.status === 404){
       title = "404";
       message = "Page or resource not found";
    }
    return (
        <>
            <MainNavigation/>
            <PageContent title = {title}>
                <p>{message}</p>
            </PageContent>
        </>
    )
}

export default ErrorPage;