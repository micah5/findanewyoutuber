<template>
    <div class="core-summary d-flex flex-wrap justify-content-center">
        <div class="stat-circle stat-circle--comments" :data-value="totalComments" data-type="comments"></div>
        <div class="stat-circle stat-circle--submitted" :data-value="totalSubmitted" data-type="submissions"></div>
        <div class="stat-circle stat-circle--controversiality" :data-value="controversiality" data-type="% controversial"></div>
        <div class="stat-circle stat-circle--per-comment" :data-value="karmaPerComment" data-type="karma/comment"></div>
        <div class="stat-circle stat-circle--per-submission" :data-value="karmaPerSubmitted" data-type="karma/submission"></div>
    </div>
</template>

<script>
export default {
    name: 'summary-circles',
    props: ['totalComments', 'totalSubmitted', 'controversiality', 'karmaPerComment', 'karmaPerSubmitted']
}
</script>

<style lang="scss">
.stat-circle {
    position: relative;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    border: 3px solid;
    text-align: center;
    margin: 0 2rem 1rem;

    &::before {
        position: absolute;
        content: attr(data-value);
        color: #555;
        text-align: center;
        font-weight: 300;
        font-size: 1.7rem;
        top: 50%;
        transform: translate(-50%, -60%);
    }

    &::after {
        position: absolute;
        content: attr(data-type);
        text-transform: uppercase;
        background-color: #555;
        text-align: center;
        min-width: 100px;
        font-size: 80%;
        padding: 4px 10px;
        left: 50%;
        bottom: -3px;
        transform: translateX(-50%);
        color: rgba(0,0,0,0.9);
        font-weight: 600;
        border-radius: 50px;
        white-space: nowrap;
    }

    &--comments {
        $comments-color: #ba97ff;

        border-color: $comments-color;

        &::before {
            color: lighten($comments-color, 10);
        }

        &::after {
            background-color: $comments-color;
        }
    }

    &--submitted {
        $submitted-color: #ff9372;

        border-color: $submitted-color;

        &::before {
            color: lighten($submitted-color, 15);
        }

        &::after {
            background-color: $submitted-color;
        }
    }

    &--controversiality {
        $controversiality-color: #f3ea88;

        border-color: $controversiality-color;

        &::before {
            color: lighten($controversiality-color, 15);
        }

        &::after {
            background-color: $controversiality-color;
        }
    }

    &--per-comment {
        $per-comment-color: #74e681;

        border-color: $per-comment-color;

        &::before {
            color: lighten($per-comment-color, 15);
        }

        &::after {
            background-color: $per-comment-color;
        }
    }

    &--per-submission {
        $per-submission-color: #24f1fb;

        border-color: $per-submission-color;

        &::before {
            color: lighten($per-submission-color, 15);
        }

        &::after {
            background-color: $per-submission-color;
        }
    }
}
</style>
