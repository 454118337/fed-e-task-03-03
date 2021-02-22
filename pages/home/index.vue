<template>
    <div class="home-page" data-test="测试用">

        <div class="banner">
            <div class="container">
                <h1 class="logo-font">conduit -- 老王测试 -- 测试部署</h1>
                <p>A place to share your knowledge.</p>
            </div>
        </div>

        <div class="container page">
            <div class="row">

                <div class="col-md-9">
                    <div class="feed-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item"
                                v-if="user"
                            >
                                <nuxt-link class="nav-link"
                                           :class="{
                                               active:tab === 'your_feed'
                                           }"
                                           exact
                                           :to="{
                                            name:'home',
                                            query:{
                                                tab:'your_feed',
                                            }
                                           }"
                                >
                                    Your Feed
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link class="nav-link"
                                           :class="{
                                               active:tab === 'global_feed'
                                           }"
                                           exact
                                           :to="{
                                            name:'home',
                                            query:{
                                                tab:'global_feed'
                                            }
                                           }">
                                    Global Feed
                                </nuxt-link>
                            </li>
                            <li class="nav-item " v-if="tag">
                                <nuxt-link class="nav-link "
                                           :class="{
                                               active:tab === 'tag'
                                           }"
                                           exact
                                           :to="{
                                            name:'home',
                                            query:{
                                                tab:'tag',
                                                tag:tag
                                            }
                                           }">
                                    <i class="ion-pound"></i>
                                    {{tag}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <div class="article-preview"
                         v-for="article in articles"
                         :key="article.slug"
                    >
                        <div class="article-meta">
                            <nuxt-link :to="{
                                name:'profile',
                                params:{
                                    username:article.author.username
                                }
                            }">
                                <img :src="article.author.image"/>
                            </nuxt-link>
                            <div class="info">
                                <nuxt-link
                                        :to="{
                                        name:'profile',
                                        params:{
                                            username:article.author.username
                                        }
                                    }"
                                        class="author">
                                    {{article.author.username}}
                                </nuxt-link>
                                <span class="date">{{article.createdAt | date(`MMM DD,YYYY`)}}</span>
                            </div>
                            <button
                                    class="btn btn-outline-primary btn-sm pull-xs-right "
                                    :class="{
                                    active:article.favorited
                                }"
                                    @click="onFavorite(article)"
                                    :disabled="article.favoriteDisabled"
                            >
                                <i class="ion-heart"></i> {{article.favoritesCount}}
                            </button>
                        </div>
                        <nuxt-link
                                class="preview-link"
                                :to="{
                                  name:'article',
                                  params:{
                                    slug:article.slug
                                  }
                            }"
                        >
                            <h1>{{article.title}}</h1>
                            <p>{{article.description}}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                                <li class="tag-default tag-pill tag-outline" v-for="tag in article.tagList">
                                    {{tag}}
                                </li>
                            </ul>
                        </nuxt-link>

                    </div>

                    <!--分页-->
                    <nav>
                        <ul class="pagination">
                            <li class="page-item"
                                :class="{
                                    active:item ===page
                                }"
                                v-for="item in totalPage"
                                :key="item"
                            >
                                <nuxt-link
                                        class="page-link"
                                        :to="{
                                        name:'home',
                                        query:{
                                            page:item,
                                            tag:tag,
                                            tab:tab
                                        }
                                    }"
                                >
                                    {{item}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </nav>

                </div>

                <div class="col-md-3">
                    <div class="sidebar">
                        <p>Popular Tags</p>

                        <div class="tag-list">
                            <nuxt-link
                                    class="tag-pill tag-default"
                                    v-for="(item,index) in tags"
                                    :key="index"
                                    :to="{
                                        name:'home',
                                        query:{
                                            tab:'tag',
                                            tag:item,
                                        }
                                    }"
                            >

                                {{item}}
                            </nuxt-link>

                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
    import {getArticles, getArticlesFeed, addFavorite, deleteFavorite} from "../../api/articles";
    import {getTags} from "../../api/tag";
    import {mapState} from 'vuex'

    export default {
        name: "HomeIndex",
        watchQuery: ['page', 'tag', 'tab'],
        async asyncData({query, store}) {
            const {page: queryPage, tag,} = query

            const page = parseInt(queryPage) || 1
            const limit = 20
            const tab = query.tab || 'global_feed'
            const loadArticles =
                store.state.user && tab === 'your_feed'
                    ? getArticlesFeed
                    : getArticles
            const [articlesRes, tagRes] = await Promise.all([
                loadArticles({
                    limit,
                    offset: (page - 1) * limit,
                    tag,
                }),
                getTags()
            ])

            const {articles, articlesCount} = articlesRes.data
            articles.forEach(article => article.favoriteDisabled = false)
            const {tags} = tagRes.data
            return {
                articles,
                articlesCount,
                tags,
                limit,
                page,
                tag,
                tab
            }
        },
        computed: {
            ...mapState(['user']),
            totalPage() {
                return Math.ceil(this.articlesCount / this.limit)
            }
        },
        methods: {
            async onFavorite(article) {
                if (!this.user) {
                    this.$router.push('/login')
                    return
                }
                article.favoriteDisabled = true
                if (article.favorited) {
                    // 取消点赞
                    await deleteFavorite(article.slug)
                    article.favorited = false
                    article.favoritesCount += -1
                } else {
                    //添加点赞
                    await addFavorite(article.slug)
                    article.favorited = true
                    article.favoritesCount += 1
                }
                article.favoriteDisabled = false
            }
        }
    }
</script>

<style scoped>

</style>