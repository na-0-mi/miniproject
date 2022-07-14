function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2srt(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

function post() {
    let gu = $('#gu').val()
    let dong = $('#dong').val()
    let star = $('#star').val()
    let star1 = $('#star1').val()
    let star2 = $('#star2').val()
    let star3 = $('#star3').val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            gu_give: gu,
            dong_give: dong,
            chung_give: star,
            ann_give: star1,
            gyo_give: star2,
            pyun_give: star3,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}


function get_posts(username) {
    if (username == undefined) {
        username = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?username_give=${username}`,
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)

                    let gu = posts[i]['gu']
                    let dong = posts[i]['dong']
                    let star = posts[i]['chung']
                    let star1 = posts[i]['ann']
                    let star2 = posts[i]['gyo']
                    let star3 = posts[i]['pyun']

                    let star_image = '⭐'.repeat(star)
                    let star1_image = '⭐'.repeat(star1)
                    let star2_image = '⭐'.repeat(star2)
                    let star3_image = '⭐'.repeat(star3)

                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let count_heart = post['count_heart']


                    let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                               
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                 
                                                  <p>${gu}</p>
                                                  <p>${dong}</p>
                                                  <p>청결점수:${star_image}</p>
                                                  <p>안전점수:${star1_image}</p>
                                                  <p>교통점수:${star2_image}</p>
                                                  <p>편리점수:${star3_image}</p>
                                                     <p>
                                                        <small>${time_before}</small>
                                                       </p>

                                                </div>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}




