import React from "react";
import {Card, CardImg, CardText, CardBody,
    CardTitle,  Media, Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link} from "react-router-dom";

function RenderDish({dish}) {
    return (
        <Card>
            <CardImg src={dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
    );
}

function RenderComments({comments}){
    
    if(comments){
        const renderList = comments.map(comment => {
            return (
                    <Media key={comment.id}>
                        <Media body>
                            <p>
                                {comment.comment}
                            </p>
                            <p>
                                -- {comment.author}, {formatDate(comment.date)}
                            </p>
                        </Media>
                    </Media>
                )
            }
        )
        return (
            <div>
                <h4>Comments</h4>
                    {renderList}
            </div>
        )

    } else {
        return (
            <div>
                <h4>Comments</h4>
                <p>No Comment is Available</p>
            </div>
        )
    }
}

function formatDate(date){
    const dateStr = new Date(date.substring(0, 19));
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dateStr.getDate()} ${month[dateStr.getMonth()]}, ${dateStr.getFullYear()}`;
}

function DishDetail (props) {
    if(props.dish != null)
        return(
            <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link to="/menu">Menu</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem active>
                                {props.dish.name}
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <RenderComments comments={props.comments} />
                        </div>
                    </div>
            </div>
            
        );
    else
        return(
            <div></div>
        );
}


export default DishDetail;