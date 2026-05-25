# 業務名單小工具(Sales Lead Finder)

用免費的 OpenStreetMap 資料,依「地區 + 商家類型」找出潛在客戶(餐廳、咖啡店、飯店、辦公室、零售店…),自動去除重複、依「好不好聯絡」排序,最後匯出成一份 CSV 名單,可以直接用 Excel 打開。

- ✅ **不用申請任何 API key**
- ✅ **不用花錢**
- ✅ **不用安裝任何套件**(只用 Python 內建功能)

---

## 一、先確認電腦有 Python

打開終端機(Mac:「終端機 Terminal」;Windows:「命令提示字元 cmd」或「PowerShell」),輸入:

```sh
python3 --version
```

- 有看到像 `Python 3.11.x` 的字 → 很好,繼續下一步。
- Windows 如果 `python3` 沒反應,改打 `python --version`。
- 完全沒有 → 到 https://www.python.org/downloads/ 下載安裝(安裝時記得勾選「Add Python to PATH」)。

> 下面範例都用 `python3`。如果你是 Windows 且要用 `python`,把指令裡的 `python3` 換成 `python` 就好。

---

## 二、進到工具的資料夾

```sh
cd sales-agent
```

(`cd` 就是「切換到某個資料夾」。請先切到這個專案資料夾底下的 `sales-agent`。)

---

## 三、開始找名單

最基本的用法 —— 找「孟沙(Bangsar)」的餐廳、咖啡店、飯店:

```sh
python3 find_leads.py --area "Bangsar, Kuala Lumpur" --types restaurant,cafe,hotel --out leads.csv
```

跑完會在 `sales-agent` 資料夾裡產生一個 `leads.csv`,用 Excel 或 Google 試算表打開即可。

---

## 四、常用參數一覽

| 參數 | 意思 | 範例 |
|------|------|------|
| `--area` | **(必填)** 要搜尋的地區,用引號括起來 | `--area "Petaling Jaya"` |
| `--types` | 要找的商家類型(用逗號分隔) | `--types restaurant,cafe` |
| `--require` | 只保留「有」這些聯絡方式的店家(`phone`/`website`/`email`) | `--require phone` |
| `--limit` | 最多保留幾筆 | `--limit 50` |
| `--out` | 輸出的檔名 | `--out pj.csv` |
| `--list-types` | 列出所有可用的類型 | `--list-types` |

### 可用的商家類型

| 類型代碼 | 中文 |
|----------|------|
| `restaurant` | 餐廳 |
| `cafe` | 咖啡店 |
| `bar` | 酒吧 / Pub |
| `fast_food` | 速食店 |
| `hotel` | 飯店 / 民宿 / 青旅 |
| `office` | 辦公室 |
| `retail` | 零售店 |
| `salon` | 美髮 / 美容 / SPA |
| `gym` | 健身房 |
| `clinic` | 診所 / 牙醫 |
| `bakery` | 烘焙坊 |

隨時可用這個指令查清單:

```sh
python3 find_leads.py --list-types
```

---

## 五、實用範例

**只要有電話的餐廳,最多 50 筆:**
```sh
python3 find_leads.py --area "Petaling Jaya" --types restaurant --require phone --limit 50 --out pj_restaurants.csv
```

**找飯店和咖啡店,而且要同時有電話又有網站:**
```sh
python3 find_leads.py --area "Mont Kiara, Kuala Lumpur" --types hotel,cafe --require phone,website
```

**找辦公室(potential office 設計案):**
```sh
python3 find_leads.py --area "Bangsar South" --types office --require website
```

---

## 六、CSV 裡的欄位是什麼

| 欄位 | 說明 |
|------|------|
| `name` | 店名 |
| `category` | 類型 |
| `phone` | 電話 |
| `website` | 網站 |
| `email` | 電子郵件 |
| `address` | 地址 |
| `opening_hours` | 營業時間 |
| `cuisine` | 菜系(餐廳才有) |
| `osm_url` | 在地圖上核對這家店的連結 |
| `source` | 資料來源(OpenStreetMap) |
| `lat` / `lon` | 座標 |
| `score` | **可聯絡程度分數**(有電話 +1、網站 +1、email +1,分數高的排前面) |

> 建議的用法:先看 `score` 高的(最好聯絡),搭配 `osm_url` 點進去確認地點沒錯,再開始打電話 / 寄信。

---

## 七、注意事項

- **沒有評分/評論數**:OpenStreetMap 是地圖資料,沒有 Google 那種星級評分。如果需要評分,要升級用 Google Places(需 Google API key)。
- **資料完整度看當地**:有些店家在地圖上沒有填電話或網站,屬正常現象;`score` 為 0 代表它沒留任何聯絡方式。
- **請禮貌使用**:工具已經內建了禮貌的等待時間,不要短時間瘋狂連續跑很多次,以免被免費伺服器暫時擋住。

---

## 八、常見問題

**Q：跑出來說「Could not find any place」?**
地區名字太細或拼錯。試試換成大一點的範圍,例如把社區名換成城市名,或加上城市:`"Bangsar, Kuala Lumpur"`。

**Q:跑出來 0 筆?**
換個 `--types`,或拿掉 `--require` 再試一次(`--require` 會把沒留聯絡方式的店家濾掉)。

**Q:出現連線/網路錯誤?**
通常是一時的。等幾秒再跑一次即可;工具本身會自動換一個備援伺服器重試。

---

## 之後可以加的功能(需要時再跟我說)

1. **用 Claude 自動判斷 + 寫開場白**:每一筆幫你判斷「像不像會需要室內設計」,並草擬一句個人化的開發訊息(需 Anthropic API key)。
2. **升級 Google Places**:補上星級評分、評論數、更完整的電話與網站(需 Google API key)。
