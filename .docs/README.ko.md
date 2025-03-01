# Figmable

![Image](https://github.com/user-attachments/assets/094e589d-c835-484d-95bd-f32fc55a88f0)
[English](README.md) | 한국어

Figmable은 Figma 디자인 파일의 컬러 변수를 CSS 파일과 직접 동기화하는 CLI 도구입니다. Figma에서 컬러 변수를 추출하고 CSS 파일을 자동으로 업데이트하여 디자인-개발 워크플로우를 원활하게 만듭니다.

## 빠른 시작

```bash
# 1. 설정 저장 (최초 1회)
figmable config --fileKey YOUR_KEY --token YOUR_TOKEN --path ./src/styles/global.css

# 2. Figmable 실행 - 끝! 🎉
figmable

# CSS 파일이 Figma 컬러 변수로 업데이트되었습니다!
```

단 두 개의 명령어로 완료! Figmable이 자동으로:

- Figma에서 컬러 변수를 가져오고
- JSON으로 저장하고
- CSS 파일을 업데이트하고
- 안전하게 백업까지 생성합니다

## 특징

- 🎨 Figma 파일에서 컬러 변수 추출
- 🔄 CSS 파일과 자동 동기화
- 🔒 기존 CSS 변수 보존
- 💾 업데이트 전 CSS 파일 자동 백업
- 📦 워크플로우에 쉽게 통합
- ⚡️ 간단한 설정 관리

## 사전 준비사항

1. **Figma API 토큰**

   - Figma > 계정 설정 > Access tokens으로 이동
   - 새 액세스 토큰 생성
   - 토큰을 복사하여 보관

2. **Figma 파일 키**

   - 브라우저에서 Figma 파일 열기
   - URL에서 키 복사: `figma.com/file/YOUR_FILE_KEY/...`

3. **Figma 컬러 오브젝트**

![Image](https://github.com/user-attachments/assets/094e589d-c835-484d-95bd-f32fc55a88f0)

- 컬러 오브젝트의 이름 앞에 `--` 접두사를 붙여주세요 (예: `--primary-500`, `--orange-600`)
- 이 네이밍 규칙은 Figmable이 컬러 변수를 식별하고 추출하는데 필요합니다
- 예시:
  ```
  --primary-500  →  #3B82F6
  --orange-600   →  #EA580C
  --neutral-900  →  #171717
  ```

4. **CSS 파일**

   - CSS에 `:root` 선택자가 필요합니다
   - 예시:

     ```css
     /* Tailwind 사용 시 */
     @layer base {
       :root {
         /* CSS 변수가 여기에 추가됩니다 */
         --primary: #000000;
       }
     }

     /* 또는 일반 CSS도 가능합니다 */
     :root {
       /* CSS 변수가 여기에 추가됩니다 */
       --primary: #000000;
     }
     ```

## 설치

```bash
npm install -g figmable
```

## 사용법

### 1. 설정 저장

먼저 Figma 인증 정보와 파일 경로를 저장합니다:

```bash
figmable config \
  --fileKey YOUR_FIGMA_FILE_KEY \
  --token YOUR_FIGMA_API_TOKEN \
  --path ./path/to/your/global.css
```

### 2. 현재 설정 확인

저장된 설정을 확인합니다:

```bash
figmable show
```

다음 정보가 표시됩니다:

- Figma 파일 키와 URL
- API 토큰
- 파일 경로
- 설정 파일 위치 (직접 수정 가능)

### 3. 변수 동기화

설정 후 간단히 실행:

```bash
figmable
```

실행 시:

1. Figma 파일에서 컬러 변수를 가져옵니다
2. `figma-variables.json`에 저장합니다
3. CSS 파일을 업데이트합니다
4. CSS 파일의 백업을 생성합니다 (`.bak`)

### 고급 사용법

단일 실행 시 설정 덮어쓰기:

```bash
figmable \
  --fileKey DIFFERENT_KEY \
  --token DIFFERENT_TOKEN \
  --path ./different/path.css \
  --output ./different/variables.json
```

백업 파일 생성 비활성화:

```bash
figmable --no-backup
# 또는
figmable -nb
```

백업 파일 생성 활성화 (기본 동작):

```bash
figmable --backup
# 또는 그냥
figmable
```

## 파일 구조

- `.figmablerc`: 설정 파일 (홈 디렉토리에 자동 생성)
- `figma-variables.json`: 추출된 Figma 변수 (프로젝트 디렉토리에 생성)
- `your-css-file.css.bak`: 백업 파일 (CSS 파일 옆에 생성)

## 오류 처리

Figmable은 다음과 같은 일반적인 문제에 대해 명확한 오류 메시지를 제공합니다:

- 유효하지 않은 Figma API 토큰
- 파일 접근 권한
- 누락되거나 유효하지 않은 파일 경로
- JSON 파싱 오류
- CSS 파일 수정 오류

## 기여

기여는 언제나 환영합니다! Pull Request를 자유롭게 제출해주세요.

## 라이선스

MIT

## 작성자

Byungsker
