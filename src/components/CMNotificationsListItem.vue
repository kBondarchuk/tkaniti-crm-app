<template>
  <!-- <div class="comment" @click="$emit('eventDetails', item.id)">

    <div class="content">
      <div class="date">
        <span class="date">{{$filters.date(item.date_created )}}</span>
      </div>
      <div class="author">{{ item.content_title }}</div>
   <a class="author subtitle">{{ item.content_subtitle }}</a>
   <div class="text">{{ item.content_body }}</div>
     <div class="actions">
        <a>Получателей: {{ item.receivers_count }}</a>
        <a>Отправлено: {{ item.sent_count }}</a>
        <a>Прочитано: {{ item.read_count }}</a>
      </div>
    </div>
  </div> -->
  <div class="item" @click="$emit('eventDetails', item.id)">
    <div class="content">
      <div class="date">{{ $filters.date(item.date_created) }}</div>
      <div class="title">{{ item.content_title }}</div>
      <div class="actions">
        <span>Получателей: {{ item.receivers_count }}</span>
        <span>Отправлено: {{ item.sent_count }}</span>
        <span>Прочитано: {{ item.read_count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CMNotificationsListItem",
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
.ui.comments .item {
  padding-left: 1em;
  padding-bottom: 0.5em;
  padding-top: 0.5em;

  margin-top: 0;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
}
.ui.comments .item:first-child {
  margin-top: 0;
  padding-top: 0.5em;
}
.ui.comments .item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.ui.comments .active.item {
  -webkit-box-shadow: none;
  box-shadow: none;
  background: rgba(0, 0, 0, 0.07);
}
.ui.comments .item .date {
  /* margin: 0; */
  word-wrap: break-word;
  color: rgba(0, 0, 0, 0.4);
  /* line-height: 1.3; */
  /* background-color: red; */
  /* text-align: right; */
  font-size: 0.875em;
  cursor: default;
}

.ui.comments .item .title {
  cursor: default;
}

.ui.comments .item .actions {
  font-size: 0.875em;
}

.ui.comments .item .actions span {
  cursor: default;
  display: inline-block;
  margin: 0 0.75em 0 0;
  color: rgba(0, 0, 0, 0.4);
}

/* .ui.comments .comment .date span.date {
  line-height: 1;
  font-size: 0.85714286rem;
  margin: 0 1em;
  padding-top: 0;
  padding-bottom: 0;
  color: rgba(0, 0, 0, 0.4);
} */

/* .ui.comments .comment .author {
  font-weight: inherit;
  margin-bottom: 0.4em;
} */
</style>
