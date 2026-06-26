<script setup lang="ts">
import { onMounted, ref } from "vue";
import {auditNews, deleteNews, newsList} from "@/http/news.ts";

const newsListData = ref<NewsItem[]>([]);
const totalNum = ref(0);
const currentPage = ref(1);
const pageSize = 3;

interface NewsItem {
  id: number;
  title: string;
  content: string;
  status: string;
  auditStatus?: string;   // 改为可选，模板中的 select 可能会直接绑定
}

// HTML 标签去除和截断
const stripHTML = (html: string) => {
  return html.replace(/<[^>]+>/g, "").trim();
};

// 通用加载函数
const loadPage = async (page: number) => {
  // 确保页码合法
  if (page < 1) page = 1;
  if (totalNum.value > 0 && page > totalNum.value) page = totalNum.value;

  const { totalPage, data } = await newsList(page, pageSize);
  totalNum.value = totalPage;
  currentPage.value = page;

  // 内容预处理
  newsListData.value = data.map((news: any) => {
    let text = stripHTML(news.content);
    if (text.length > 60) {
      text = text.substring(0, 60) + "...";
    }
    return { ...news, content: text };
  });
};

// 首页
const goFirst = () => loadPage(1);
// 尾页
const goLast = () => loadPage(totalNum.value);
// 上一页
const prev = () => loadPage(currentPage.value - 1);
// 下一页
const next = () => loadPage(currentPage.value + 1);

onMounted(() => {
  loadPage(1);
});

const newsDelete = async (id: number) => {
  if (!confirm('确定要删除该新闻吗？')) return
  try {
    await deleteNews(id)
    // 重新加载当前页
    await loadPage(currentPage.value)
  } catch (error) {
    console.error('删除失败', error)
    alert('删除失败')
  }
}

const handleAudit = async (news: any) => {
  try {
    await auditNews(news.id, news.auditStatus);
    await loadPage(currentPage.value);
  } catch (error) {
    console.error("审核失败", error);
    alert("审核失败");
  }
};
</script>

<template>
  <div>
    <table>
      <tr>
        <th>新闻标题</th>
        <th>正文摘要</th>
        <th>审核状态</th>
        <th>操作</th>
      </tr>
      <tr v-for="news in newsListData" :key="news.id">
        <td>{{ news.title }}</td>
        <td>{{ news.content }}</td>
        <td>{{ news.status }}</td>
        <td class="work-button">
          <select v-model="news.auditStatus" style="margin-right: 6px;">
            <option value="PENDING_REVIEW">待审核</option>
            <option value="PASS">审核通过</option>
            <option value="NOT_PASS">审核不通过</option>
          </select>
          <button @click="handleAudit(news)">修改审核</button>
          <button @click="newsDelete(news.id)">删除新闻</button>
        </td>
      </tr>
    </table>

    <div class="pagination-bar">
      共 {{ totalNum }} 页
      <button @click="goFirst" :disabled="currentPage === 1">首页</button>
      <button @click="prev" :disabled="currentPage === 1">上一页</button>
      <button @click="next" :disabled="currentPage === totalNum">下一页</button>
      <button @click="goLast" :disabled="currentPage === totalNum || totalNum === 0">尾页</button>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;              /* 表格占满容器 */
  table-layout: fixed;      /* 固定列宽，便于控制各列比例 */
}
th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 8px 12px;
  text-align: center;
  overflow: hidden;
  word-break: break-all;    /* 过长内容自动换行 */
}
/* 设置各列宽度比例 */
th:nth-child(1), td:nth-child(1) { width: 20%; }  /* 新闻标题 */
th:nth-child(2), td:nth-child(2) { width: 45%; }  /* 正文摘要 — 拉宽 */
th:nth-child(3), td:nth-child(3) { width: 15%; }  /* 审核状态 */
th:nth-child(4), td:nth-child(4) { width: 20%; }  /* 操作 */

/* 分页按钮固定在底部 */
.pagination-bar {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 12px 144px 12px 0;
  text-align: right;
  border-top: 1px solid #eee;
  z-index: 10;
}
.pagination-bar button {
  margin-left: 8px;
}
.work-button {
  width: 100%;       /* 占满当前列的宽度 */
  padding: 0;        /* 去掉多余的单元格内边距，让布局更紧凑 */
}

</style>