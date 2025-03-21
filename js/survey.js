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
        thankYouPanel.style.display = 'block';
        overlay.style.display = 'block';
        setTimeout(() => {
            window.location.href = 'https://noa901.github.io/ai-hp-website/events.html';
        }, 3000);
    }

    // 处理表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 验证未来主题选择
        if (!validateFutureTopics()) {
            return;
        }

        // 禁用提交按钮，防止重复提交
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>送信中...</span>';

        // 将多选项合并为逗号分隔的字符串
        const futureTopics = Array.from(document.querySelectorAll('input[name="future_topics[]"]:checked'))
            .map(checkbox => checkbox.value)
            .join(', ');
        
        // 创建隐藏的输入字段来存储合并后的值
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'future_topics';
        hiddenInput.value = futureTopics;
        form.appendChild(hiddenInput);

        // 移除原始的多选框数组
        document.querySelectorAll('input[name="future_topics[]"]').forEach(checkbox => {
            checkbox.disabled = true;
        });

        // 使用 fetch 提交表单
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        })
        .then(response => {
            if (response.ok) {
                // 提交成功后显示感谢面板
                showThankYouPanel();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // 恢复提交按钮状态
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i><span>送信する</span>';
            alert('送信に失敗しました。もう一度お試しください。');
        });
    });
}); 