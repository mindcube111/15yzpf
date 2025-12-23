const photoForm = document.getElementById("photo-form");
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");
const photoPreviewFrame = document.getElementById("photo-preview-frame");
const uploadHint = document.getElementById("upload-hint");
const scoreNumberEl = document.getElementById("score-number");
const scoreTaglineEl = document.getElementById("score-tagline");
const scoreDetailEl = document.getElementById("score-detail");

/**
 * 预览选择的图片
 */
function previewImage(file) {
  if (!file || !photoPreview || !photoPreviewFrame) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.src = e.target?.result || "";
    photoPreview.style.display = "block";
    const placeholder = photoPreviewFrame.querySelector(
      ".photo-preview-placeholder"
    );
    if (placeholder) {
      placeholder.style.display = "none";
    }
  };
  reader.readAsDataURL(file);
}

/**
 * 根据图片生成一个“娱乐颜值分”
 * 说明：不做真实人脸识别，仅随机范围内浮动
 */
function clampScore(val) {
  const rounded = Math.round(val * 10) / 10;
  return Math.min(100, Math.max(70, rounded));
}

function calcImageScore() {
  // 随机生成 70–100 分之间的一位小数
  const score = 70 + Math.random() * 30;
  return clampScore(score);
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

function renderResult(score) {
  // 当前页面（开始页）已经没有结果卡片，此函数只作为兜底使用
  if (!scoreNumberEl || !scoreTaglineEl || !scoreDetailEl) return;

  scoreNumberEl.textContent = score.toString();

  const { tagline, detail } = getComment(score);
  scoreTaglineEl.textContent = tagline;

  scoreDetailEl.innerHTML = "";
  detail.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    scoreDetailEl.appendChild(li);
  });
}

if (photoForm) {
  // 选择文件时预览
  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      if (uploadHint) {
        uploadHint.textContent = "请选择图片文件进行测试。";
        uploadHint.style.color = "var(--danger)";
      }
      return;
    }
    if (uploadHint) {
      uploadHint.textContent = "建议：正脸、光线充足、无遮挡，效果更有趣。";
      uploadHint.style.color = "var(--text-muted)";
    }
    previewImage(file);
  });

  // 提交时打分并跳转结果页
  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = photoInput?.files?.[0];
    if (!file) {
      if (uploadHint) {
        uploadHint.textContent = "请先选择一张照片再点击“上传并打分”。";
        uploadHint.style.color = "var(--danger)";
      }
      return;
    }

    const score = clampScore(calcImageScore());
    try {
      localStorage.setItem(
        "face-score-result",
        JSON.stringify({ score, createdAt: Date.now() })
      );
    } catch {
      // ignore storage errors, 直接在当前页展示
      renderResult(score);
      return;
    }

    window.location.href = "./result.html";
  });
}


