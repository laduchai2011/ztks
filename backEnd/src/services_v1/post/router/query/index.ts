import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_GetRegisterPosts from './handle/GetRegisterPosts';
import Handle_GetPosts from './handle/GetPosts';
import Handle_GetPostWithId from './handle/GetPostWithId';
import Handle_GetRegisterPostWithId from './handle/GetRegisterPostWithId';

dotenv.config();
const router_query_post: Router = express.Router();

const handle_getRegisterPosts = new Handle_GetRegisterPosts();
const handle_getPosts = new Handle_GetPosts();
const handle_getPostWithId = new Handle_GetPostWithId();
const handle_getRegisterPostWithId = new Handle_GetRegisterPostWithId();

router_query_post.post('/getRegisterPosts', handle_getRegisterPosts.main);

router_query_post.post('/getPosts', handle_getPosts.main);

router_query_post.post('/getPostWithId', handle_getPostWithId.main);

router_query_post.post('/getRegisterPostWithId', handle_getRegisterPostWithId.main);

export default router_query_post;
