"""Y-CAS 集成测试 - 验证 index.html 和 report-generator.html"""
from playwright.sync_api import sync_playwright
import sys

errors = []
warnings = []

def log(msg):
    print(f"[TEST] {msg}")

def check(name, condition, detail=""):
    if condition:
        log(f"PASS: {name}")
    else:
        log(f"FAIL: {name} {detail}")
        errors.append(f"{name}: {detail}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # 捕获控制台错误
    console_errors = []
    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

    # ========== 测试1: index.html ==========
    log("=" * 50)
    log("测试 index.html")
    log("=" * 50)

    resp = page.goto("http://localhost:8899/index.html", wait_until="networkidle", timeout=30000)
    check("index.html HTTP状态", resp.status == 200, f"status={resp.status}")

    title = page.title()
    check("index.html 页面标题", "Y-CAS" in title, f"title='{title}'")

    # 检查核心元素
    heading = page.locator("h1")
    check("index.html 有H1标题", heading.count() > 0)

    links = page.locator("a[href='report-generator.html']")
    check("index.html 有报告生成器链接", links.count() > 0, f"count={links.count()}")

    page.screenshot(path="/tmp/ycas-index.png", full_page=True)
    log("截图已保存: /tmp/ycas-index.png")

    # ========== 测试2: report-generator.html 基础加载 ==========
    log("")
    log("=" * 50)
    log("测试 report-generator.html 基础加载")
    log("=" * 50)

    console_errors.clear()
    resp2 = page.goto("http://localhost:8899/report-generator.html", wait_until="networkidle", timeout=30000)
    check("report-generator.html HTTP状态", resp2.status == 200, f"status={resp2.status}")

    page.wait_for_timeout(2000)  # 等待CDN资源加载

    # 检查JS错误
    js_errors = [e for e in console_errors if "favicon" not in e.lower()]
    check("无JS控制台错误", len(js_errors) == 0, f"errors={js_errors[:3]}")

    # 检查工具栏
    toolbar = page.locator("#toolbar")
    check("工具栏存在", toolbar.count() > 0)

    # 检查标签页按钮
    tab_form = page.locator("[data-tab='form']")
    tab_batch = page.locator("[data-tab='batch']")
    tab_config = page.locator("[data-tab='config']")
    check("单用户录入标签存在", tab_form.count() > 0)
    check("批量导入标签存在", tab_batch.count() > 0)
    check("配置编辑标签存在", tab_config.count() > 0)

    # 检查表单面板
    form = page.locator("#report-form")
    check("表单存在", form.count() > 0)

    # 检查关键表单字段
    name_input = page.locator("input[name='childName']")
    check("儿童姓名输入框存在", name_input.count() > 0)

    gender_radio = page.locator("input[name='gender']")
    check("性别单选按钮存在", gender_radio.count() >= 2, f"count={gender_radio.count()}")

    height_input = page.locator("input[name='height']")
    check("身高输入框存在", height_input.count() > 0)

    d1_range = page.locator("input[name='d1Score']")
    check("D1评分滑块存在", d1_range.count() > 0)

    page.screenshot(path="/tmp/ycas-form.png", full_page=True)
    log("截图已保存: /tmp/ycas-form.png")

    # ========== 测试3: 加载示例数据并生成报告 ==========
    log("")
    log("=" * 50)
    log("测试 加载示例数据 -> 生成报告")
    log("=" * 50)

    console_errors.clear()

    # 点击 "加载示例数据" 按钮
    sample_btn = page.locator("text=加载示例数据")
    check("加载示例数据按钮存在", sample_btn.count() > 0)

    if sample_btn.count() > 0:
        sample_btn.click()
        page.wait_for_timeout(500)

        # 验证表单已填充
        name_val = name_input.input_value()
        check("示例数据已填入姓名", len(name_val) > 0, f"value='{name_val}'")

        height_val = height_input.input_value()
        check("示例数据已填入身高", len(height_val) > 0, f"value='{height_val}'")

        page.screenshot(path="/tmp/ycas-form-filled.png", full_page=True)
        log("截图已保存: /tmp/ycas-form-filled.png")

    # 点击 "生成并预览报告"
    preview_btn = page.locator("#btn-preview")
    check("生成并预览按钮存在", preview_btn.count() > 0)

    if preview_btn.count() > 0:
        preview_btn.click()
        page.wait_for_timeout(2000)  # 等待渲染和图表

        # 验证报告容器显示
        report_container = page.locator("#report-container")
        is_visible = report_container.is_visible()
        check("报告容器可见", is_visible)

        # 验证6页报告都已渲染
        pages = page.locator(".page")
        page_count = pages.count()
        check("报告共6页", page_count == 6, f"count={page_count}")

        # 验证封面内容
        cover = page.locator("[data-page='1']")
        cover_text = cover.inner_text() if cover.count() > 0 else ""
        check("封面包含报告标题", "评估报告" in cover_text, f"text_len={len(cover_text)}")
        check("封面包含评估编号", "YCAS" in cover_text)

        # 验证基础档案页
        page2 = page.locator("[data-page='2']")
        page2_text = page2.inner_text() if page2.count() > 0 else ""
        check("档案页包含儿童信息", "张小萌" in page2_text or len(page2_text) > 50)

        # 验证4D评估页 - 雷达图canvas
        radar = page.locator("#radarChart")
        check("雷达图Canvas存在", radar.count() > 0)

        # 验证4D评估页内容
        page3 = page.locator("[data-page='3']")
        page3_text = page3.inner_text() if page3.count() > 0 else ""
        check("4D评估页包含评分", "D1" in page3_text or "睡眠" in page3_text)

        # 验证预测页
        page4 = page.locator("[data-page='4']")
        page4_text = page4.inner_text() if page4.count() > 0 else ""
        check("预测页包含身高数据", "cm" in page4_text)

        # 验证干预方案页
        page5 = page.locator("[data-page='5']")
        page5_text = page5.inner_text() if page5.count() > 0 else ""
        check("干预方案页有内容", len(page5_text) > 50)

        # 验证结论页
        page6 = page.locator("[data-page='6']")
        page6_text = page6.inner_text() if page6.count() > 0 else ""
        check("结论页有内容", len(page6_text) > 50)

        # JS错误检查
        js_errors2 = [e for e in console_errors if "favicon" not in e.lower()]
        check("报告渲染无JS错误", len(js_errors2) == 0, f"errors={js_errors2[:3]}")

        page.screenshot(path="/tmp/ycas-report-preview.png", full_page=True)
        log("截图已保存: /tmp/ycas-report-preview.png")

    # ========== 测试4: 标签页切换 ==========
    log("")
    log("=" * 50)
    log("测试 标签页切换")
    log("=" * 50)

    # 切换回编辑模式
    edit_btn = page.locator("#toolbar button:has-text('编辑')")
    if edit_btn.count() > 0:
        edit_btn.click()
        page.wait_for_timeout(500)

    # 切到批量导入
    if tab_batch.count() > 0:
        tab_batch.click()
        page.wait_for_timeout(500)

        drop_zone = page.locator("#drop-zone")
        check("批量导入拖拽区域存在", drop_zone.count() > 0)

        template_btn = page.locator("text=下载Excel模板")
        check("下载模板按钮存在", template_btn.count() > 0)

        page.screenshot(path="/tmp/ycas-batch.png", full_page=True)
        log("截图已保存: /tmp/ycas-batch.png")

    # 切到配置编辑
    if tab_config.count() > 0:
        tab_config.click()
        page.wait_for_timeout(500)

        textarea = page.locator("#config-textarea")
        check("配置编辑文本框存在", textarea.count() > 0)

        config_val = textarea.input_value() if textarea.count() > 0 else ""
        check("配置编辑已加载JSON", len(config_val) > 100, f"len={len(config_val)}")

        page.screenshot(path="/tmp/ycas-config.png", full_page=True)
        log("截图已保存: /tmp/ycas-config.png")

    # ========== 测试总结 ==========
    log("")
    log("=" * 50)
    log("测试总结")
    log("=" * 50)

    browser.close()

if errors:
    log(f"FAILED: {len(errors)} 项测试失败")
    for e in errors:
        log(f"  - {e}")
    sys.exit(1)
else:
    log("ALL PASSED: 所有测试通过")
    sys.exit(0)
