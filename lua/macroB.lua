count = 30

for i = 1, count do
    -- 初期
    yield("/ac 確信 <wait.3>")
    yield("/ac マニピュレーション <wait.3>")
    action = HasCondition("sturdy") and "加工" or "倹約加工"
    yield("/ac " .. action .. " <wait.3>")

    -- 工数上げ
    yield("/ac ヴェネレーション <wait.3>")
    action = HasCondition("pliant") and "長期倹約" or "倹約"
    yield("/ac " .. action .. " <wait.3>")
    action = HasCondition("good") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>")
    action = HasCondition("good") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>")
    action = HasCondition("good") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>")

    -- 品質上げ
    inner = 8
    yield("/ac 加工 <wait.3>")
    yield("/ac 中級加工 <wait.3>")
    if (HasCondition("good")) then
        yield("/ac 集中加工 <wait.3>")
        inner = inner + 1
    else
        yield("/ac 上級加工 <wait.3>")
    end
    yield("/ac マニピュレーション <wait.3>")
    yield("/ac イノベーション <wait.3>")
    yield("/ac 倹約加工 <wait.3>")
    yield("/ac 加工 <wait.3>")
    yield("/ac 中級加工 <wait.3>")
    if (HasCondition("good")) then
        yield("/ac 集中加工 <wait.3>")
        inner = inner + 1
    else
        yield("/ac 上級加工 <wait.3>")
    end

    -- 余裕があれば上げるフェーズ
    -- マニピュレーションの回復込みの残り耐久
    restDu = GetDurability() + 15  -- 3ターン分

    while (true) do
        oneMore = false
        if (HasCondition("good")) then
            if (restDu >= 36 + 10 and GetCp() >= 167 + 18) then
                yield("/ac 集中加工 <wait.3>")
                restDu = restDu - 10
                inner = inner + 2
            else
                yield("/ac 秘訣 <wait.3>")
            end
            oneMore = true
        end
        if (inner >= 10 and GetCp() >= 167 + 32) then
            yield("/ac 匠の神業 <wait.3>")
            oneMore = true
        end
        if (restDu >= 36 + 10 and GetCp() >= 167 + 18) then
            yield("/ac 加工 <wait.3>")
            restDu = restDu - 10
            inner = inner + 1
            oneMore = true
        end
        if (not oneMore) then
            break
        end
    end

    -- ここから下で耐久36以上、CP167あればOK
    yield("/ac イノベーション <wait.3>")
    if (HasCondition("good") and restDu > 35) then
        yield("/ac 集中加工 <wait.3>")
        restDu = restDu - 10
    else
        yield("/ac 倹約加工 <wait.3>")
        restDu = restDu - 5
    end
    action = (HasCondition("good") and restDu > 30) and "集中加工" or "倹約加工"
    yield("/ac " .. action .. " <wait.3>")
    yield("/ac グレートストライド <wait.3>")
    yield("/ac ビエルゴの祝福 <wait.3>")

    -- 仕上げ
    yield("/ac ヴェネレーション <wait.3>")
    yield("/ac 倹約作業 <wait.3>")
    if (HasCondition("good")) then
        yield("/ac 集中作業 <wait.3>")
    else
        if (GetCp() >= 18) then
            yield("/ac 倹約作業 <wait.3>")
            yield("/ac 作業 <wait.3>")
        else
            yield("/ac 模範作業 <wait.3>")
            yield("/ac 作業 <wait.3>")
        end
    end
    yield("/click synthesize")
end
