const scoreNumberEl = document.getElementById("score-number");
const scoreTaglineEl = document.getElementById("score-tagline");
const scoreDetailEl = document.getElementById("score-detail");
const analysisTreeEl = document.getElementById("analysis-tree");
const resultMetaEl = document.getElementById("result-meta");
const backBtn = document.getElementById("back-btn");

function getSavedResult() {
  try {
    const raw = localStorage.getItem("face-score-result");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSavedResult() {
  try {
    localStorage.removeItem("face-score-result");
  } catch {
    // ignore
  }
}

function getComment(score) {
  if (score >= 99.5) {
    return {
      tagline: "👑 满格颜值时刻，镜头自动给你开挂。",
      detail: [
        "🌠 任何角度都能封神，建议收藏为“心情回血图库”。",
        "📀 多拍几组不同风格，足够做年度影集封面轮播。",
      ],
    };
  }

  if (score >= 98) {
    return {
      tagline: "🏆 颜值封神，镜头自动自带柔光滤镜。",
      detail: [
        "📸 随手一按快门就是杂志封面，摄影师会爱上你的可塑性。",
        "💫 维持好状态，多拍几套风格，足够做一整年的头像轮播。",
      ],
    };
  }

  if (score >= 95) {
    return {
      tagline: "🥇 镜头看到你都会先起立鼓掌。",
      detail: [
        "✨ 发型、光线随便配都能稳出大片，别人还以为你有专属修图师。",
        "🎁 记得多存几张，遇到选图困难症时，这就是免死金牌。",
      ],
    };
  }

  if (score >= 92) {
    return {
      tagline: "💎 高级脸档位，气质和五官都在线。",
      detail: [
        "🌌 侧脸线条很加分，随便一束逆光都能拍出电影感。",
        "🧴 维持水光肌和好体态，你的照片会自带“质感滤镜”。",
      ],
    };
  }

  if (score >= 88) {
    return {
      tagline: "🌟 人群里自带光圈，易被认出也易被记住。",
      detail: [
        "🎯 轻微微笑 + 抬下巴 5 度，气场立刻升级。",
        "🪞 尝试冷暖两套妆面，朋友圈会以为你换了造型师。",
      ],
    };
  }

  if (score >= 85) {
    return {
      tagline: "🎬 气质挂选手，镜头语言比滤镜更好用。",
      detail: [
        "📽️ 低饱和穿搭 + 干净背景，轻松拿下电影感照片。",
        "📈 练习 2-3 个稳妥角度，你的相册可以开始卖票了。",
      ],
    };
  }

  if (score >= 80) {
    return {
      tagline: "😎 耐看型颜值，越看越上头。",
      detail: [
        "🌤️ 顺光或侧光都适合你，表情放松会更加分。",
        "🧥 尝试层次感穿搭，照片立刻有“杂志随拍”质感。",
      ],
    };
  }

  if (score >= 76) {
    return {
      tagline: "📷 上镜友好型，随便拍都有故事感。",
      detail: [
        "💡 记得补点光和抬高取景，五官会更立体。",
        "🧢 帽子、眼镜等小配饰能帮你轻松换风格。",
      ],
    };
  }

  return {
    tagline: "🌱 潜力款好看，稍微打理就能乱杀朋友圈。",
    detail: [
      "✨ 调整发型与光线，找到最适合的侧脸角度。",
      "💧 作息+补水+微笑，镜头会越来越喜欢你。",
    ],
  };
}

function animateScore(targetScore) {
  if (!scoreNumberEl) return;
  const duration = 900; // ms
  const start = performance.now();
  const startValue = 0;

  function step(now) {
    const progress = Math.min(1, (now - start) / duration);
    const current = startValue + (targetScore - startValue) * progress;
    scoreNumberEl.textContent = current.toFixed(1);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return "刚刚 · 娱乐分数";
  const diff = Date.now() - timestamp;
  if (diff < 60 * 1000) return "刚刚 · 娱乐分数";
  if (diff < 60 * 60 * 1000) {
    const mins = Math.max(1, Math.floor(diff / (60 * 1000)));
    return `${mins} 分钟前 · 娱乐分数`;
  }
  const date = new Date(timestamp);
  const formatted = date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${formatted} · 娱乐分数`;
}

function clampScore(val) {
  const rounded = Math.round(val * 10) / 10;
  return Math.min(100, Math.max(70, rounded));
}

function renderResult(score) {
  if (!scoreTaglineEl || !scoreDetailEl) return;
  const safeScore = clampScore(score);
  const { tagline, detail } = getComment(safeScore);
  scoreTaglineEl.textContent = tagline;

  scoreDetailEl.innerHTML = "";
  detail.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    scoreDetailEl.appendChild(li);
  });

  document.body.classList.add("result-ready");
}

function generateSubScores(score) {
  // 把总分映射到 70~100，再加入一点随机浮动
  const base = Math.min(100, Math.max(70, score));
  const jitter = () =>
    Math.max(70, Math.min(100, base + (Math.random() - 0.5) * 8));
  return {
    facial: Math.round(jitter()),
    bone: Math.round(jitter()),
    skin: Math.round(jitter()),
  };
}

function renderAnalysis(score) {
  if (!analysisTreeEl) return;
  const safeScore = clampScore(score);
  const { facial, bone, skin } = generateSubScores(safeScore);

  const branches = [
    {
      key: "facial",
      label: "五官精致度",
      emoji: "👁️",
      score: facial,
      desc:
        facial >= 90
          ? "五官比例在线，镜头拉近也扛得住。"
          : facial >= 80
          ? "整体协调耐看，抓住适合自己的妆发就很加分。"
          : "有记忆点的小五官，通过修饰也能很好看。",
    },
    {
      key: "bone",
      label: "骨相与轮廓",
      emoji: "📐",
      score: bone,
      desc:
        bone >= 90
          ? "轮廓立体，侧脸很容易拍出大片感。"
          : bone >= 80
          ? "线条顺滑耐看，日常生活中非常加分。"
          : "轮廓偏柔和，适合走气质和氛围路线。",
    },
    {
      key: "skin",
      label: "皮相与状态",
      emoji: "💧",
      score: skin,
      desc:
        skin >= 90
          ? "皮肤状态优秀，自带柔光滤镜。"
          : skin >= 80
          ? "整体状态良好，作息规律一点会更惊艳。"
          : "多补水多睡觉，皮相的提升空间很大～",
    },
  ];

  analysisTreeEl.innerHTML = "";

  branches.forEach((item) => {
    const branch = document.createElement("div");
    branch.className = "analysis-branch";

    const header = document.createElement("div");
    header.className = "branch-header";
    const label = document.createElement("div");
    label.className = "branch-label";
    label.textContent = `${item.emoji} ${item.label}`;
    const scoreEl = document.createElement("div");
    scoreEl.className = "branch-score";
    scoreEl.textContent = `${item.score} 分`;
    header.appendChild(label);
    header.appendChild(scoreEl);

    const bar = document.createElement("div");
    bar.className = "branch-bar";
    const fill = document.createElement("div");
    fill.className = "branch-bar-fill";
    // 使用 setTimeout 触发过渡动画
    requestAnimationFrame(() => {
      fill.style.width = `${item.score}%`;
    });
    bar.appendChild(fill);

    const desc = document.createElement("p");
    desc.className = "branch-desc";
    desc.textContent = item.desc;

    branch.appendChild(header);
    branch.appendChild(bar);
    branch.appendChild(desc);

    analysisTreeEl.appendChild(branch);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = getSavedResult();
  if (!saved || typeof saved.score !== "number") {
    // 没有正常结果时，跳回首页
    window.location.href = "./index.html";
    return;
  }

  const score = clampScore(saved.score);
  if (resultMetaEl) {
    resultMetaEl.textContent = formatRelativeTime(saved.createdAt);
  }
  clearSavedResult();

  animateScore(score);
  renderResult(score);
  renderAnalysis(score);
});

backBtn?.addEventListener("click", () => {
  window.location.href = "./index.html";
});


