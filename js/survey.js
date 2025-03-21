document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const otherAffiliation = document.getElementById('otherAffiliation');
    const otherTopic = document.getElementById('otherTopic');
    const futureTopicsError = document.getElementById('future-topics-error');
    const thankYouPanel = document.getElementById('thankYouPanel');
    const overlay = document.getElementById('overlay');

    // 处理"その他"选项的显示
    document.querySelectorAll('input[name="organization"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = this.closest('.form-group').querySelector('.other-input');
            otherInput.style.display = this.value === 'その他' ? 'block' : 'none';
        });
    });

    // 处理"その他"主题的显示
    document.querySelectorAll('input[name="future_topics[]"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const otherInput = this.closest('.form-group').querySelector('.other-input');
            const otherCheckbox = document.querySelector('input[name="future_topics[]"][value="その他"]');
            otherInput.style.display = otherCheckbox.checked ? 'block' : 'none';
            validateFutureTopics();
        });
    });

    // 验证未来主题选择
    function validateFutureTopics() {
        const checkboxes = document.querySelectorAll('input[name="future_topics[]"]:checked');
        const errorMessage = document.getElementById('future-topics-error');
        if (checkboxes.length === 0) {
            errorMessage.style.display = 'block';
            return false;
        } else {
            errorMessage.style.display = 'none';
            return true;
        }
    }

    // 显示感谢面板
    function showThankYouPanel() {
        // 重置面板状态
        thankYouPanel.classList.remove('show');
        overlay.classList.remove('show');
        
        // 设置初始显示
        thankYouPanel.style.display = 'block';
        overlay.style.display = 'block';
        
        // 强制重排
        thankYouPanel.offsetHeight;
        overlay.offsetHeight;
        
        // 添加动画类
        setTimeout(() => {
            thankYouPanel.classList.add('show');
            overlay.classList.add('show');
        }, 10);
        
        // 3秒后跳转
        setTimeout(() => {
            window.location.href = 'https://noa901.github.io/ai-hp-website/events.html';
        }, 3000);
    }

    // 处理表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 验证未来主题选择
        if (!validateFutureTopics()) {
            return;
        }

        // 禁用提交按钮，防止重复提交
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>送信中...</span>';

        // 准备表单数据
        const formData = new FormData(form);
        
        // 处理多选项
        const futureTopics = Array.from(document.querySelectorAll('input[name="future_topics[]"]:checked'))
            .map(checkbox => checkbox.value)
            .join(', ');
        formData.set('future_topics', futureTopics);

        // 立即显示感谢面板
        showThankYouPanel();

        try {
            // 在后台继续处理表单提交
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error:', error);
            // 即使提交失败也不显示错误，因为用户已经看到了感谢面板
        }
    });
}); 