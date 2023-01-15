<template>
  <tr @click="$emit('eventDetails', item)">
    <td v-if="showId">
      <i class="red circle icon" :class="{ green: item.cleared == 1 }" style="vertical-align: initial"></i>
      {{ item.id }}
    </td>
    <td>{{ $filters.date(item.date) }}</td>
    <td>
      <!-- {{ item.operation_name }} -->
      <TKOperationType :type="item.operation_name" />
      <UIBadge v-if="item.amount < 0" text="Сторно" class="background-color-red text-color-white" />
    </td>
    <!-- <td v-if="showBasis">{{ item.category_name }}</td> -->

    <td v-if="showObject">
      <strong>{{ item.object_name }}</strong>
    </td>

    <td v-if="showBranch">
      {{ item.branch }}
    </td>

    <template v-if="showSubjects">
      <td class="nobr">{{ item.subject1_type }}: {{ item.subject_id1 }}</td>
      <!--  -->
      <td class="nobr">{{ item.subject2_type }}: {{ item.subject_id2 }}</td>
    </template>

    <td v-if="showAuthor">
      {{ item.user }}
    </td>
    <!--  -->

    <template v-if="showDoubleAmount">
      <td class="right aligned" :class="{ negative: item.amount < 0 && item.amount_type != 'n' }">
        <span v-if="item.amount_type != 'n'" class="nobr">
          <strong>{{ $filters.money(item.amount) }}</strong>
        </span>
      </td>
      <!--  -->
      <td class="right aligned" :class="{ negative: item.amount < 0 && item.amount_type == 'n' }">
        <span v-if="item.amount_type == 'n'" class="nobr">
          <strong>{{ $filters.money(item.amount) }}</strong>
        </span>
      </td>
    </template>
    <!--  -->
    <td v-else class="right aligned">
      <strong class="nobr">{{ $filters.money(item.amount) }}</strong>
    </td>
    <!--  -->
    <td v-if="showBasis"><TKLinkOrder :id="item.basis_id" /></td>
    <td>{{ item.notes }}</td>
  </tr>
</template>

<script>
import TKOperationType from "@/components/TKOperationType.vue";
import TKLinkOrder from "@/components/TKLinkOrder.vue";

export default {
  name: "TKOperationsListItem",

  components: {
    TKOperationType,
    TKLinkOrder,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
    showId: {
      type: Boolean,
      default: true,
    },
    showBranch: {
      type: Boolean,
      default: false,
    },
    showAuthor: {
      type: Boolean,
      default: true,
    },
    showBasis: {
      type: Boolean,
      default: true,
    },
    showDoubleAmount: {
      type: Boolean,
      default: true,
    },
    showSubjects: {
      type: Boolean,
      default: false,
    },
    showObject: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["eventDetails"],
};
</script>
