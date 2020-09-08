import React, {Component} from "react";
import {Card, CardImg, CardText, CardBody,
    CardTitle,  Media} from "reactstrap";

class DishDetail extends Component{
    constructor(props){
        super(props);
    }

    renderComments(commentArr){
        if(commentArr){
            const renderList = commentArr.map(comment => {
                return (
                        <Media key={comment.id}>
                            <Media body>
                                <p>
                                    {comment.comment}
                                </p>
                                <p>
                                    -- {comment.author}, {this.formatDate(comment.date)}
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

    formatDate(date){
        const dateStr = new Date(date.substring(0, 19));
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${dateStr.getDate()} ${month[dateStr.getMonth()]}, ${dateStr.getFullYear()}`;
    }

    render(){
        console.log(this.props.dish);
        if(this.props.dish != null)
            return(
                <div className="container">
                     <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <Card>
                                <CardImg src={this.props.dish.image} alt={this.props.dish.name} />
                                <CardBody>
                                    <CardTitle>{this.props.dish.name}</CardTitle>
                                    <CardText>{this.props.dish.description}</CardText>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            {this.renderComments(this.props.dish.comments)}
                        </div>
                    </div>
                </div>
               
            );
            else
                return(
                    <div></div>
                );
    }
}

export default DishDetail;