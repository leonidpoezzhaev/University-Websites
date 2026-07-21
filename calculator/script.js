function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    function simplifyFraction(numerator, denominator) {
        if (denominator === 0) return null;
        if (numerator === 0) return { num: 0, den: 1 };
        let commonDiv = gcd(numerator, denominator);
        let newNum = numerator / commonDiv;
        let newDen = denominator / commonDiv;
        if (newDen < 0) {
            newNum = -newNum;
            newDen = -newDen;
        }
        return { num: newNum, den: newDen };
    }

    function getFractionFromInputs() {
        let n1 = parseInt(document.getElementById('num1').value);
        let d1 = parseInt(document.getElementById('den1').value);
        let n2 = parseInt(document.getElementById('num2').value);
        let d2 = parseInt(document.getElementById('den2').value);
        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) return null;
        if (d1 === 0 || d2 === 0) return null;
        return {
            a: { num: n1, den: d1 },
            b: { num: n2, den: d2 }
        };
    }

    function addFractions(f1, f2) {
        let numerator = f1.num * f2.den + f2.num * f1.den;
        let denominator = f1.den * f2.den;
        return simplifyFraction(numerator, denominator);
    }

    function subtractFractions(f1, f2) {
        let numerator = f1.num * f2.den - f2.num * f1.den;
        let denominator = f1.den * f2.den;
        return simplifyFraction(numerator, denominator);
    }

    function multiplyFractions(f1, f2) {
        let numerator = f1.num * f2.num;
        let denominator = f1.den * f2.den;
        return simplifyFraction(numerator, denominator);
    }

    function divideFractions(f1, f2) {
        if (f2.num === 0) return null;
        let numerator = f1.num * f2.den;
        let denominator = f1.den * f2.num;
        return simplifyFraction(numerator, denominator);
    }

    function displayResult(resultObj) {
        const resultP = document.getElementById('resultDisplay');
        if (resultObj === null) {
            resultP.innerHTML = '<span class="error-text">❌ Ошибка (деление на 0 или знаменатель 0)</span>';
            return;
        }
        if (resultObj.den === 1) {
            resultP.innerHTML = `${resultObj.num}`;
        } else {
            resultP.innerHTML = `${resultObj.num} / ${resultObj.den}`;
        }
    }

    function computeAndShow(operation) {
        const fractions = getFractionFromInputs();
        if (!fractions) {
            document.getElementById('resultDisplay').innerHTML = '<span class="error-text">⚠️ Введите целые числа, знаменатели ≠ 0</span>';
            return;
        }
        let result;
        switch(operation) {
            case 'add':
                result = addFractions(fractions.a, fractions.b);
                break;
            case 'sub':
                result = subtractFractions(fractions.a, fractions.b);
                break;
            case 'mul':
                result = multiplyFractions(fractions.a, fractions.b);
                break;
            case 'div':
                if (fractions.b.num === 0) {
                    document.getElementById('resultDisplay').innerHTML = '<span class="error-text">❌ Деление на ноль невозможно</span>';
                    return;
                }
                result = divideFractions(fractions.a, fractions.b);
                break;
            default: result = null;
        }
        if (result === null) {
            document.getElementById('resultDisplay').innerHTML = '<span class="error-text">❌ Ошибка вычисления</span>';
        } else {
            displayResult(result);
        }
    }

    document.getElementById('addBtn').addEventListener('click', function() { computeAndShow('add'); });
    document.getElementById('subBtn').addEventListener('click', function() { computeAndShow('sub'); });
    document.getElementById('mulBtn').addEventListener('click', function() { computeAndShow('mul'); });
    document.getElementById('divBtn').addEventListener('click', function() { computeAndShow('div'); });