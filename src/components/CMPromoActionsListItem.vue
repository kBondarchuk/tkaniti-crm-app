<template>
  <div class="comment" @click="$emit('eventDetails', item.id)">
    <!-- <a class="avatar">
              <img src="/images/avatar/small/matt.jpg" />
    </a>-->
    <div class="content">
      <div class="date">
        <span v-if="item.status == 0" class="ui label">Черновик</span>
        <span v-if="item.status == 1" class="ui green label">Активна</span>
        <span v-if="item.status == 2" class="ui grey label">Завершена</span>
        <span v-if="item.status > 2" class="ui label">{{ item.status }}</span>
        <span class="date">{{ $filters.date(item.date1) }} &ndash; {{ $filters.date(item.date2) }}</span>
      </div>
      <a class="author">{{ item.name }}</a>
      <!-- <div class="metadata">
        <span class="date">{{$filters.date(item.last_upload_date )}}</span>
      </div> -->
      <div class="text">{{ item.notes }}</div>
      <div class="actions"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CMPromoActionsListItem",
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
  methods: {},
};
</script>

<style scoped>
.ui.comments .comment {
  padding-left: 1em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;

  margin-top: 0;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
}
.ui.comments .comment:first-child {
  margin-top: 0;
  padding-top: 0.5em;
}
.ui.comments .comment:hover {
  background: rgba(0, 0, 0, 0.05);
}

.ui.comments .active.comment {
  -webkit-box-shadow: none;
  box-shadow: none;
  background: rgba(0, 0, 0, 0.07);
}
.ui.comments .comment .date {
  margin: 0.1em 0 0.4em;
  font-size: 1em;
  word-wrap: break-word;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.3;
}

.ui.comments .comment .date span.date {
  line-height: 1;
  font-size: 0.85714286rem;
  float: right;
  margin: 0 1em;
  padding-top: 0.4em;
  padding-bottom: 0.4em;
  color: rgba(0, 0, 0, 0.4);
}
</style>
