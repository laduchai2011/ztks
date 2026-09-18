import express, { Router } from 'express';
import dotenv from 'dotenv';
import Handle_Get_Register_Posts from './handle/Get_Register_Posts';
import Handle_Get_Posts from './handle/Get_Posts';
import Handle_Get_Post_With_Id from './handle/Get_Post_With_Id';
import Handle_Get_Register_Post_With_Id from './handle/Get_Register_Post_With_Id';

dotenv.config();
const router_query_post: Router = express.Router();

const handle_get_register_posts = new Handle_Get_Register_Posts();
const handle_get_posts = new Handle_Get_Posts();
const handle_get_post_with_id = new Handle_Get_Post_With_Id();
const handle_get_register_post_with_id = new Handle_Get_Register_Post_With_Id();

router_query_post.post('/get_register_posts', handle_get_register_posts.main);

router_query_post.post('/get_posts', handle_get_posts.main);

router_query_post.post('/get_post_with_id', handle_get_post_with_id.main);

router_query_post.post('/get_register_post_with_id', handle_get_register_post_with_id.main);

export default router_query_post;
