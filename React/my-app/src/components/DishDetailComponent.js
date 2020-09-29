import React, {Component} from "react";
import {Card, CardImg, CardText, CardBody,
    CardTitle,  Media, Breadcrumb, BreadcrumbItem,
    Button, Modal, ModalBody, ModalHeader, 
    Row, Label} from "reactstrap";
import {Link} from "react-router-dom";
import {Control, LocalForm, Errors} from "react-redux-form";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

function  RenderDish({dish}) {
    return (
        <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </FadeTransform>
        
    );
}

function  RenderComments({comments, postComment, dishId}){
        
    if(comments){
        return (
            <div >
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment) => {
                            return (
                                <Fade in>
                                <li key={comment.id}>
                                <p>{comment.comment}</p>
                                <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                    
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )

    } else {
        return (
            <div >
                <h4>Comments</h4>
                <p>No Comment is Available</p>
            </div>
        )
    }
}


class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleSubmit(values){
        //e.preventDefault();
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }   
    render() {
        const required = (val) => val && val.length;
        const maxLength = (len) => (val) => !(val) || (val.length <= len);
        const minLength = (len) => (val) => val && (val.length >= len);
        return(
            <div>
                <Button color="primary" onClick={this.toggleModal}>
                    <span className="fa fa-info fa-lg"></span>
                    Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    Submit Comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group ml-2 mr-2">
                            <Label htmlFor="username">
                                Rating
                            </Label>
                        
                            <Control.select 
                                model=".rating" 
                                name="rating" 
                                id="rating"
                                className="form-control custom-select"
                                placeholder="Select Rating"
                                validators={{
                                    required
                                }}
                            >       
                                    <option selected>Open this select menu</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                            </Control.select>
                            
                            <Errors
                                className="text-danger"
                                model=".rating"
                                show="touched"
                                messages={{
                                    required: "Required"
                                }}
                            />
                        </Row>
                        <Row className="form-group ml-2 mr-2">
                            <Label htmlFor="password">
                                Your Name
                            </Label>
                            <Control.text
                                model=".name"
                                id="name"
                                name="name"
                                placeholder="Your Name"
                                className="form-control"
                                validators={{
                                    required,
                                    minLength: minLength(3),
                                    maxLength: maxLength(15)
                                }}
                            />
                            <Errors
                                className="text-danger"
                                model=".name"
                                show="touched"
                                messages={{
                                    required: "Required",
                                    minLength: "Must be greater than 2 characters",
                                    maxLength: "Must be 15 characters or less"
                                }}
                            />
                        </Row>
                        <Row className="form-group ml-2 mr-2">
                            <Label htmlFor="comment">
                                Comment
                            </Label>
                            <Control.textarea
                                model=".comment" 
                                name="comment" 
                                id="comment" 
                                rows="6"
                                placeholder="Your comment goes here"
                                className="form-control"
                                validators={{
                                    required,
                                    minLength: minLength(5),
                                    maxLength: maxLength(150)
                                }}
                            />
                            <Errors
                                className="text-danger"
                                model=".comment"
                                show="touched"
                                messages={{
                                    required: "Required",
                                    minLength: "Must be greater than 5 characters",
                                    maxLength: "Must be 150 characters or less"
                                }}
                            />
                        </Row>
                        <Row className="form-group ml-2 mr-2">
                            <Button 
                                type="submit"
                                value="submit"
                                color="primary"
                            >
                                Login
                            </Button>
                        </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
        </div>
        );
    }

}

function DishDetail (props){
    if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return(
            <div className="container">
                <div className="row">            
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if(props.dish != null)
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
                            <RenderComments comments={props.comments} 
                                        postComment={props.postComment}
                                        dishId={props.dish.id}/>
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