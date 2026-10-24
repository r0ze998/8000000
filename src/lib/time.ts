export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

export const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

/** 暗くなりやすい時間帯。夜の参拝をすすめないための注意に使う */
export const isDarkHours = (d = new Date()) => d.getHours() >= 18 || d.getHours() < 6;
