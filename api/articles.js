import {request} from "../plugins/request";


// 获取公共的文章列表
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}
// 获取关注的用户文章列表
export const getArticlesFeed = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    })
}
//添加点赞
export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`,
    })
}
//取消点赞
export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`,
    })
}
//获取文章详情
export const getArticle = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`,
    })
}
//获取文章评论
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`,
    })
}

// 评论文章
export const addComment = (slug, body) => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data: {body}
    })
}
// 删除文章评论
export const deleteComment = (slug, id) => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/comments/${id}`,
    })
}

// 发表文章
export const createArticle = data => {
    return request({
        method: 'POST',
        url: '/api/articles',
        data
    })
}
// 删除已发表文章
export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`,
    })
}

// 更新文章详情
export const updateArticle = (slug, data) => {
    return request({
        method: 'PUT',
        url: `/api/articles/${slug}`,
        data
    })
}
// 关注作者
export const addFollow = (username) => {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`,
    })
}
// 取消关注作者
export const unFollow = (username) => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`,
    })
}