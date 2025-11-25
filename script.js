// ==================== 通用函数 ====================

// 更新用户问候语
function updateGreeting() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const greetingElements = document.querySelectorAll('#userGreeting');
    
    greetingElements.forEach(element => {
        if (user.email) {
            const userName = user.email.split('@')[0];
            element.textContent = `Hello, ${userName}`;
        } else {
            element.textContent = 'Hello';
        }
    });
}

// 登出功能
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// 检查登录状态
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// 获取今天的餐食
function getTodayMeals() {
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    const today = new Date().toLocaleDateString();
    return meals.filter(meal => meal.date === today);
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用状态
function initializeApp() {
    // 检查是否有登录信息
    const currentUser = localStorage.getItem('currentUser');
    const currentPath = window.location.pathname;
    
    // 如果未登录且不在登录页，跳转到登录页
    if (!currentUser && !currentPath.includes('login')) {
        window.location.href = 'login.html';
        return;
    }
    
    // 如果已登录，显示用户名
    if (currentUser) {
        updateUserGreeting(currentUser);
        
        // 如果在登录页且已登录，跳转到首页
        if (currentPath.includes('login')) {
            window.location.href = 'index.html';
            return;
        }
    }
    
    // 初始化页面特定功能
    initializePageFeatures();
}

// 更新用户欢迎信息
function updateUserGreeting(username) {
    const greetingElements = document.querySelectorAll('#userGreeting');
    greetingElements.forEach(element => {
        element.textContent = `Hello, ${username}`;
    });
}

// 初始化页面特定功能
function initializePageFeatures() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('login')) {
        initializeLoginPage();
    } else if (currentPath.includes('index')) {
        initializeHomePage();
    } else if (currentPath.includes('add')) {
        initializeAddPage();
    } else if (currentPath.includes('report')) {
        initializeReportPage();
    }
}

// ============ 登录页面功能 ============
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // 从email中提取用户名（@符号前的部分）
        const username = email.split('@')[0];
        
        // 保存登录信息到localStorage
        localStorage.setItem('currentUser', username);
        localStorage.setItem('userEmail', email);
        
        // 显示登录成功动画
        showLoginSuccess(username);
        
        // 延迟跳转到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// 显示登录成功动画
function showLoginSuccess(username) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `
            <span>Welcome, ${username}!</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        loginBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }
}

// ============ 首页功能 ============
function initializeHomePage() {
    updateHomeStats();
    
    // 添加欢迎动画
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const hour = new Date().getHours();
        let greeting = 'How was your meal today?';
        
        if (hour < 12) {
            greeting = 'Good morning! Ready for breakfast?';
        } else if (hour < 17) {
            greeting = 'Good afternoon! Time for lunch?';
        } else {
            greeting = 'Good evening! What\'s for dinner?';
        }
        
        mainTitle.textContent = greeting;
    }
}

// 更新首页统计
function updateHomeStats() {
    const meals = getMeals();
    const todayMeals = filterTodayMeals(meals);
    
    // 更新餐食数量
    const todayMealsElement = document.getElementById('todayMeals');
    if (todayMealsElement) {
        todayMealsElement.textContent = todayMeals.length;
    }
    
    // 更新食物组数量
    const foodGroups = new Set();
    todayMeals.forEach(meal => {
        if (meal.includes) {
            meal.includes.forEach(group => foodGroups.add(group));
        }
    });
    
    const foodGroupsElement = document.getElementById('foodGroups');
    if (foodGroupsElement) {
        foodGroupsElement.textContent = foodGroups.size;
    }
}

// ============ 添加餐食页面功能 ============
// 在 add.html 页面加载时检查是否是编辑模式
if (window.location.pathname.includes('add.html')) {
    window.addEventListener('DOMContentLoaded', function() {
        const editingMeal = sessionStorage.getItem('editingMeal');
        
        if (editingMeal) {
            const meal = JSON.parse(editingMeal);
            
            // 填充表单
            document.getElementById('mealName').value = meal.name || '';
            document.getElementById('mealType').value = meal.type || '';
            document.getElementById('mealTime').value = meal.time || '';
            
            // 勾选食物类别
            if (meal.includes) {
                meal.includes.forEach(foodGroup => {
                    const checkbox = document.getElementById(foodGroup);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
            
            // 修改按钮文字
            const submitBtn = document.querySelector('.btn-primary');
            if (submitBtn) {
                submitBtn.innerHTML = `
                    Update
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                `;
            }
        }
    });
}

function initializeAddPage() {
    const mealForm = document.getElementById('mealForm');
    if (!mealForm) return;
    
    // 设置默认时间为当前时间
    const timeInput = document.getElementById('mealTime');
    if (timeInput) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
    }
    
    mealForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('mealName').value;
        const type = document.getElementById('mealType').value;
        const time = document.getElementById('mealTime').value;
        
        // 获取选中的食物类型
        const includes = [];
        const checkboxes = ['grains', 'protein', 'vegetables', 'fruits', 'dairy', 'snacks'];
        checkboxes.forEach(item => {
            const checkbox = document.getElementById(item);
            if (checkbox && checkbox.checked) {
                includes.push(item);
            }
        });
        
        // 验证至少选择一个食物类型
        if (includes.length === 0) {
            showNotification('Please select at least one food category', 'warning');
            return;
        }
        
        // 创建餐食对象
        const meal = {
            id: Date.now(),
            name: name,
            type: type,
            time: time,
            includes: includes,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        
        // 保存餐食
        saveMeal(meal);
        
        // 显示成功消息
        showNotification('Meal added successfully!', 'success');
        
        // 重置表单
        this.reset();
        
        // 延迟跳转到报告页
        setTimeout(() => {
            window.location.href = 'report.html';
        }, 1500);
    });
    
    // 添加食物类型选择动画
    const foodItems = document.querySelectorAll('.food-item input[type="checkbox"]');
    foodItems.forEach(item => {
        item.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.animation = 'pulse 0.5s ease';
            } else {
                label.style.animation = '';
            }
        });
    });
}

// ============ 报告页面功能 ============
function initializeReportPage() {
    updateReport();
}

// 更新报告
function updateReport() {
    const meals = getMeals();
    const todayMeals = filterTodayMeals(meals);
    
    // 更新统计卡片
    updateReportStats(todayMeals);
    
    // 显示餐食记录
    displayMealRecords(todayMeals);
    
    // 生成营养总结
    generateNutritionSummary(todayMeals);
}

function updateReport() {
    const todayMeals = getTodayMeals();
    
    // 更新统计卡片
    const totalMealsElement = document.getElementById('totalMealsCount');
    if (totalMealsElement) {
        totalMealsElement.textContent = todayMeals.length;
    }
    
    // 统计食物组
    const foodGroups = new Set();
    todayMeals.forEach(meal => {
        if (meal.includes) {
            meal.includes.forEach(group => foodGroups.add(group));
        }
    });
    
    const foodGroupsElement = document.getElementById('foodGroupsCount');
    if (foodGroupsElement) {
        foodGroupsElement.textContent = `${foodGroups.size}/6`;
    }
    
    // 获取最后一餐时间
    const lastMealElement = document.getElementById('lastMealTime');
    if (lastMealElement && todayMeals.length > 0) {
        const lastMeal = todayMeals[todayMeals.length - 1];
        lastMealElement.textContent = lastMeal.time || '--:--';
    }
    
    // 显示餐食记录
    displayMealRecords(todayMeals);
    
    // 生成报告
    generateReport(todayMeals);
}

// 显示餐食记录
function displayMealRecords(meals) {
    const recordsContainer = document.getElementById('mealRecords');
    if (!recordsContainer) return;
    
    if (meals.length === 0) {
        recordsContainer.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <p>No meals recorded yet</p>
                <button class="btn-primary" onclick="location.href='add.html'">Add your first meal</button>
            </div>
        `;
        return;
    }
    
    // 按时间排序
    meals.sort((a, b) => {
        const timeA = a.time ? a.time.split(':').join('') : '0';
        const timeB = b.time ? b.time.split(':').join('') : '0';
        return timeA - timeB;
    });
    
    recordsContainer.innerHTML = '';
    
    meals.forEach((meal, index) => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-record';
        mealDiv.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        
        // 创建食物类型指示器
        const indicators = meal.includes ? meal.includes.map(item => 
            `<div class="food-dot ${item}" title="${item}"></div>`
        ).join('') : '';
        
        mealDiv.innerHTML = `
            <div class="meal-info">
                <span class="meal-time">${meal.time || '--:--'}</span>
                <span class="meal-name">${meal.name || 'Unnamed meal'}</span>
            </div>
            <div class="meal-tags">
                ${indicators}
            </div>
            <div class="meal-actions">
                <button class="btn-edit" onclick="editMeal(${meal.id})" title="Edit">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn-delete" onclick="deleteMeal(${meal.id})" title="Delete">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        `;
        
        recordsContainer.appendChild(mealDiv);
    });
}

// 生成营养总结
// 生成报告
function generateReport(meals) {
    const reportText = document.getElementById('reportText');
    const adviceDiv = document.getElementById('nutritionAdvice');
    
    if (!reportText) return;
    
    if (meals.length === 0) {
        reportText.textContent = 'Start tracking your meals to see your nutrition summary';
        if (adviceDiv) adviceDiv.innerHTML = '';
        return;
    }
    
    // 统计食物类别
    const foodGroupCount = {};
    const allFoodGroups = ['grains', 'protein', 'vegetables', 'fruits', 'dairy', 'snacks'];
    
    allFoodGroups.forEach(group => {
        foodGroupCount[group] = 0;
    });
    
    meals.forEach(meal => {
        if (meal.includes) {
            meal.includes.forEach(group => {
                foodGroupCount[group]++;
            });
        }
    });
    
    const consumedGroups = Object.keys(foodGroupCount).filter(group => foodGroupCount[group] > 0);
    const missingGroups = allFoodGroups.filter(group => foodGroupCount[group] === 0);
    
    // 生成基本报告
    const mealCount = meals.length;
    const mealWord = mealCount === 1 ? 'meal' : 'meals';
    
    let reportHTML = `<p>Today you've had <strong>${mealCount} ${mealWord}</strong>`;
    
    if (consumedGroups.length > 0) {
        reportHTML += ` and consumed food from <strong>${consumedGroups.length} out of 6</strong> food groups. `;
        
        // 列出已吃的食物类别
        const groupNames = {
            'grains': 'grains',
            'protein': 'protein',
            'vegetables': 'vegetables',
            'fruits': 'fruits',
            'dairy': 'dairy',
            'snacks': 'snacks'
        };
        
        const consumedList = consumedGroups.map(g => groupNames[g]).join(', ');
        reportHTML += `You've included: <strong>${consumedList}</strong>.`;
    } else {
        reportHTML += `, but haven't tracked any specific food groups yet.`;
    }
    
    reportHTML += '</p>';
    reportText.innerHTML = reportHTML;
    
    // 生成营养建议
    if (adviceDiv) {
        let advice = generateNutritionAdvice(consumedGroups, missingGroups, foodGroupCount);
        adviceDiv.innerHTML = advice;
    }
}

// 生成营养建议
function generateNutritionAdvice(consumed, missing, counts) {
    if (missing.length === 0) {
        return `
            <div class="advice-great">
                <h4>🎉 Fantastic job!</h4>
                <p>You've hit all six food groups today! Your body is doing a happy dance right now. Keep up this amazing balanced eating!</p>
            </div>
        `;
    }
    
    let advice = '<div class="advice-container">';
    
    // 根据缺失的食物类别给出建议
    const suggestions = {
        'grains': {
            icon: '🌾',
            title: 'Missing Some Grains',
            text: "Your body's asking for some carb love! How about whole wheat toast, brown rice, or a warm bowl of oatmeal? They'll give you that energy boost you need.",
            examples: ['Whole grain bread', 'Brown rice', 'Quinoa', 'Oatmeal', 'Whole wheat pasta']
        },
        'protein': {
            icon: '🥩',
            title: 'Need More Protein Power',
            text: "Time to fuel those muscles! Your body is craving some protein. Think eggs, chicken, fish, beans, or tofu - pick your fighter!",
            examples: ['Grilled chicken', 'Salmon', 'Eggs', 'Greek yogurt', 'Lentils', 'Tofu']
        },
        'vegetables': {
            icon: '🥬',
            title: 'Veggie Alert!',
            text: "Uh oh, where are the veggies? Your body needs those vitamins and minerals! Sneak in some leafy greens, crunchy carrots, or colorful bell peppers.",
            examples: ['Spinach salad', 'Broccoli', 'Carrots', 'Bell peppers', 'Kale', 'Tomatoes']
        },
        'fruits': {
            icon: '🍎',
            title: 'Fruit Break Needed',
            text: "Your daily dose of natural sweetness is missing! Grab an apple, munch on some berries, or slice up a juicy orange. Nature's candy is calling!",
            examples: ['Apples', 'Bananas', 'Berries', 'Oranges', 'Grapes', 'Watermelon']
        },
        'dairy': {
            icon: '🥛',
            title: 'Dairy Department Calling',
            text: "Your bones want some calcium love! How about a glass of milk, some yogurt, or a piece of cheese? Lactose-free options work great too!",
            examples: ['Milk', 'Greek yogurt', 'Cheese', 'Cottage cheese', 'Almond milk (fortified)']
        },
        'snacks': {
            icon: '🍪',
            title: 'Treat Yourself (Smartly)',
            text: "Life needs balance! A small healthy snack won't hurt. Think nuts, dark chocolate, or popcorn - everything in moderation!",
            examples: ['Mixed nuts', 'Dark chocolate', 'Popcorn', 'Trail mix', 'Rice cakes']
        }
    };
    
    // 如果缺失超过3个类别，给出紧急提示
    if (missing.length >= 4) {
        advice += `
            <div class="advice-urgent">
                <h4>⚠️ Houston, we have a nutrition gap!</h4>
                <p>You're missing quite a few food groups today. Let's level up your nutrition game! Here's what your body is asking for:</p>
            </div>
        `;
    } else if (missing.length >= 2) {
        advice += `
            <div class="advice-moderate">
                <h4>💪 Almost there!</h4>
                <p>You're doing good, but let's make it great! Here are some suggestions to round out your day:</p>
            </div>
        `;
    } else {
        advice += `
            <div class="advice-mild">
                <h4>✨ So close to perfection!</h4>
                <p>You're almost hitting all the food groups! Just one more to go:</p>
            </div>
        `;
    }
    
    // 为每个缺失的食物类别生成建议
    missing.forEach(group => {
        const suggestion = suggestions[group];
        if (suggestion) {
            advice += `
                <div class="advice-item">
                    <div class="advice-header">
                        <span class="advice-icon">${suggestion.icon}</span>
                        <h5>${suggestion.title}</h5>
                    </div>
                    <p>${suggestion.text}</p>
                    <div class="food-suggestions">
                        <strong>Try these:</strong>
                        <div class="suggestion-tags">
                            ${suggestion.examples.map(food => `<span class="suggestion-tag">${food}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    // 如果某些类别吃得太多，给出提醒
    Object.keys(counts).forEach(group => {
        if (counts[group] >= 4 && group === 'snacks') {
            advice += `
                <div class="advice-warning">
                    <h4>🤔 Snack Attack Alert!</h4>
                    <p>Looks like you've been hitting the snacks pretty hard today (${counts[group]} times!). Maybe balance it out with some wholesome meals? Your body will thank you!</p>
                </div>
            `;
        }
    });
    
    advice += '</div>';
    return advice;
}

// ============ 数据管理功能 ============

// 获取所有餐食
function getMeals() {
    const mealsJson = localStorage.getItem('meals');
    return mealsJson ? JSON.parse(mealsJson) : [];
}

// 保存餐食
function saveMeal(mealData) {
    let meals = JSON.parse(localStorage.getItem('meals') || '[]');
    
    // 检查是否是编辑模式
    const editingMeal = sessionStorage.getItem('editingMeal');
    
    if (editingMeal) {
        // 编辑模式：更新现有餐食
        const oldMeal = JSON.parse(editingMeal);
        meals = meals.map(meal => 
            meal.id === oldMeal.id ? { ...mealData, id: oldMeal.id } : meal
        );
        sessionStorage.removeItem('editingMeal');
    } else {
        // 新增模式：添加新餐食
        mealData.id = Date.now(); // 使用时间戳作为唯一 ID
        meals.push(mealData);
    }
    
    localStorage.setItem('meals', JSON.stringify(meals));
}

// 获取今天的餐食
function getTodayMeals() {
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    const today = new Date().toLocaleDateString();
    return meals.filter(meal => meal.date === today);
}

// 过滤今日餐食
function filterTodayMeals(meals) {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(meal => meal.date === today);
}

// 删除餐食
function deleteMeal(mealId) {
    if (!confirm('Are you sure you want to delete this meal?')) {
        return;
    }
    
    let meals = JSON.parse(localStorage.getItem('meals') || '[]');
    meals = meals.filter(meal => meal.id !== mealId);
    localStorage.setItem('meals', JSON.stringify(meals));
    
    // 刷新页面
    location.reload();
}

// 编辑餐食
function editMeal(mealId) {
    const meals = JSON.parse(localStorage.getItem('meals') || '[]');
    const meal = meals.find(m => m.id === mealId);
    
    if (!meal) {
        alert('Meal not found');
        return;
    }
    
    // 将餐食数据保存到 sessionStorage 用于编辑
    sessionStorage.setItem('editingMeal', JSON.stringify(meal));
    
    // 跳转到添加页面
    window.location.href = 'add.html';
}

// ============ 通用功能 ============

// 登出功能
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${getNotificationIcon(type)}
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    return icons[type] || icons.info;
}

// 添加必要的动画CSS
if (!document.querySelector('#notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 更新用户问候
    updateGreeting();
    
    // 如果在 report 页面，更新报告
    if (window.location.pathname.includes('report.html')) {
        updateReport();
    }
    
    // 如果在 index 页面，更新统计
    if (window.location.pathname.includes('index.html')) {
        updateHomeStats();
    }
});
