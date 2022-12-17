<template>
  <div class="comment" @click="$emit('eventDetails', item.id)">
    <!--  -->
    <div class="content">
      <div class="date">
        <a
          class="ui label"
          :class="{
            green: item.status == 5,
            pink: item.status < 5 && item.checks < 5,
            blue: item.status < 5 && item.checks == 5,
          }"
        >
          {{ $filters.month(item.date) }}
        </a>
        <span class="date">{{ $filters.date(item.last_upload_date) }}</span>
      </div>
      <a class="author" :href="'/cars/' + item.car_id" title="Перейти на страницу автомобиля">{{ item.car }}</a>
      <!-- <div class="metadata">
        <span class="date">{{$filters.date(item.last_upload_date )}}</span>
      </div> -->
      <div class="text">
        {{ item.fio }} <br /><span class="text-color-grey">{{ item.branch }}</span>
      </div>
      <div class="actions">
        <!-- <a class="reply" @click="$emit('eventReload', item.id)">Обновить</a>
        <a class="delete">Удалить</a>-->
        <!-- <a class="status">Фото: {{ item.images. }}</a> -->
        <a class="status">Снимков: {{ item.items_count }}</a>
        <a class="status">Оценок: {{ item.checks }}</a>
        <a class="status">Принято: {{ item.status }}</a>
        <!-- <a class="status">{{$filters.date(item.last_upload_date )}}</a> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CMPhotoReportListItem2",

  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
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
