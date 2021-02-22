<template>
    <div>
        <form class="card comment-form" v-if="user">
            <div class="card-block">
                <textarea class="form-control"
                          placeholder="Write a comment..."
                          rows="3"
                          v-model="body"
                ></textarea>
            </div>
            <div class="card-footer">
                <img :src="user.image" class="comment-author-img"/>
                <button class="btn btn-sm btn-primary" @click.prevent="submitComment">
                    Post Comment
                </button>
            </div>
        </form>

        <p v-else>
            <nuxt-link to="/login">Sign in</nuxt-link>
            or
            <nuxt-link to="/register">sign up</nuxt-link>
            to add comments on this article.
        </p>


        <div class="card"
             v-for="comment in comments"
             :key="comment.id"
        >
            <div class="card-block">
                <p class="card-text">
                    {{comment.body}}
                </p>
            </div>
            <div class="card-footer">
                <nuxt-link class="comment-author"
                           :to="{
                              name:'profile',
                              params:{
                                username:comment.author.username
                              }
                           }"
                >
                    <img :src="comment.author.image" class="comment-author-img"/>
                </nuxt-link>
                &nbsp;
                <nuxt-link class="comment-author"
                           :to="{
                              name:'profile',
                              params:{
                                username:comment.author.username
                              }
                           }"
                >
                    {{ comment.author.username}}
                </nuxt-link>
                <span class="date-posted">{{comment.createdAt | date(`MMM DD,YYYY`)}}</span>

                <span class="mod-options"
                      v-if=" comment.author.username === user.username"
                      @click="deleteComment(comment)">
                      <i class="ion-trash-a"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import {getComments, addComment, deleteComment} from '../../../api/articles'
    import {throttle} from '../../../utils/utils'
    import {mapState} from 'vuex'

    export default {
        name: "ArticleComment",
        props: {
            article: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                comments: [],
                body: ''
            }
        },
        async mounted() {
            const {data} = await getComments(this.article.slug)
            this.comments = data.comments
        },
        computed: {
            ...mapState(['user']),
        },
        methods: {
            async submitComment() {
                const {data} = await addComment(this.article.slug, this.body)
                this.comments.unshift(data.comment)
                this.body = ''
            },
            async deleteComment(comment) {
                const that = this;
                throttle(async function () {
                    const index = that.comments.findIndex(item => item.id === comment.id);
                    if (index > -1) {
                        await deleteComment(that.article.slug, comment.id)
                        that.comments.splice(index, 1)
                    }
                }, 1000)()
            }
        }
    }
</script>

<style scoped>

</style>