

window.onload = ()=>{
    const studentPropertiesDiv = document.getElementById("student_properties_div");
    const selector = document.getElementById("num_students_selector");
    const template = document.getElementById('property_template');
    const warning = document.getElementById('warning');

    const choiceCorrection = (index)=>{
        const children = studentPropertiesDiv.children;
        const numChildren = children.length;

        if(index >= numChildren - 1)
            return;

        const selector = children[index].querySelector(".grade_selector");
        const nextSelector = children[index+1].querySelector(".grade_selector");
        
        const numOptions = nextSelector.children.length;
        for(let i = 0; i < numOptions; ++i){
            nextSelector.children[i].disabled = i < selector.selectedIndex;
        }

        if (selector.selectedIndex > nextSelector.selectedIndex) {
            nextSelector.selectedIndex = selector.selectedIndex;
        }
        nextSelector.dispatchEvent(new Event('change'));
    }

    selector.onchange = (event)=>{
        studentPropertiesDiv.textContent = '';
        const numStudents = selector.value;
        document.getElementById("header").style.display = numStudents > 0 ? null : "none";
        warning.style.display = numStudents > 0 ? null : "none";
        const totalDiv = document.getElementById("total_div");


        const calculateTotal = () =>
        {
            let total = 0;
            for(const child of studentPropertiesDiv.children) {
                const subtotalDiv = child.querySelector(".subtotal");
                total += parseFloat(subtotalDiv.dataset.price);
            }

            const sumDiv = totalDiv.querySelector(".sum");
            const finalDiv = totalDiv.querySelector(".final")

            sumDiv.textContent = "月合計: " + total.toFixed(2).toString() + " Euro";
            finalDiv.textContent = "四半期請求金額: " + total * 3 + " Euro";
        }

        for(let i = 0; i < numStudents; ++i) {
            const copiedTemplate = template.cloneNode(true);
            copiedTemplate.style.display = null;
            const baseDiv = copiedTemplate.querySelector(".base");
            const discountDiv = copiedTemplate.querySelector(".discount");
            const subtotalDiv = copiedTemplate.querySelector(".subtotal");

            const studentId = copiedTemplate.querySelector(".student_id");
            const gradeSelector = copiedTemplate.querySelector(".grade_selector");
            const mathCheckbox = copiedTemplate.querySelector(".math_checkbox");
            const calculateSubtotal = ()=>{
                let price = 0;
                switch(gradeSelector.value)
                {
                    case "nensho":
                        price += 50;
                        break;
                    case "nenchu":
                    case "elementary_or_above":
                        price += 65;
                        break;
                }
                if(mathCheckbox.checked)
                    price += 28;

                baseDiv.textContent = price;
                let discount = i * -5;
                if(gradeSelector.value === "nensho")
                    discount = discount / 3 * 2;
                discountDiv.textContent = discount.toFixed(2).toString();

                const subtotal = price + discount;
                subtotalDiv.textContent = subtotal.toFixed(2).toString();
                subtotalDiv.dataset.price = subtotal.toString();
                calculateTotal();
            }

            studentId.textContent = (i+1) + ":";
            gradeSelector.onchange = (event)=>{
                const grade = gradeSelector.value;
                switch(grade)
                {
                    case "elementary_or_above":
                        mathCheckbox.disabled = false;
                        break;
                    case "nensho":
                    case "nenchu":
                        mathCheckbox.checked = false;
                        mathCheckbox.disabled = true;
                        break;

                }
                choiceCorrection(i);
                calculateSubtotal();
            }

            mathCheckbox.onchange = (event)=>{
                calculateSubtotal();
            }

            calculateSubtotal();
            studentPropertiesDiv.append(copiedTemplate);
        }
        calculateTotal();
    }
};