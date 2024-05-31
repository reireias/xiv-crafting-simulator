-- 最終段階、マイスター、飯のみ
count = 30

for i = 1, count do
    yield("/echo 残り" .. count - i + 1 .. "回")
    yield("/click synthesize <wait.2>")
    yield("/waitaddon Synthesis")
    -- 初期
    yield("/ac 確信 <wait.3>")
    if (HasCondition("長持続")) then
        manipulation = 10
    else
        manipulation = 8
    end
    yield("/ac マニピュレーション <wait.3>")
    -- 工数上げ
    if (HasCondition("高能率")) then
        action = "長期倹約"
        wasteNot = 8
    elseif (HasCondition("長持続")) then
        action = "倹約"
        wasteNot = 6
    else
        action = "倹約"
        wasteNot = 4
    end
    yield("/ac " .. action .. " <wait.3>"); manipulation = manipulation - 1
    yield("/ac ヴェネレーション <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
    action = HasCondition("高品質") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
    action = HasCondition("高品質") and "集中作業" or "下地作業"
    yield("/ac " .. action .. " <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
    -- 進捗: 3929 - 5558
    if (HasCondition("高進捗")) then
        if (GetProgress() + 1837 < 7040) then
            yield("/ac 下地作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
        else
            yield("/ac 模範作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
        end
    elseif (HasCondition("高品質")) then
        yield("/ac 集中作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
    else
        yield("/ac 下地作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
    end
    -- 進捗: 5148 - 6914
    if (wasteNot > 0 or HasCondition("頑丈")) then
        if (HasCondition("高進捗")) then
            if (GetProgress() + 1837 < 7040) then
                yield("/ac 下地作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
            elseif (GetProgress() + 918 < 7040) then
                yield("/ac 模範作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
            end
        else
            if (GetProgress() + 1225 < 7040) then
                yield("/ac 下地作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
            elseif (GetProgress() + 612 < 7040) then
                yield("/ac 模範作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
            end
        end
    elseif (HasCondition("高品質")) then
        if (GetProgress() + 1362 < 7040) then
            yield("/ac 集中作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
        elseif (GetProgress() + 612 < 7040) then
            yield("/ac 模範作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
        end
    elseif (HasCondition("高進捗")) then
        if (GetProgress() + 918 < 7040) then
            yield("/ac 倹約作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
        end
    else
        if (GetProgress() + 612 < 7040) then
            yield("/ac 倹約作業 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
        end
    end
    -- 残進捗から完成に必要な必要なCPと耐久を計算する
    restProgress = 7040 - GetProgress()

    if (restProgress <= 408) then
      needCp = 7
      needDu = 1
      finishActions = {"模範作業"}
    elseif (restProgress <= 454) then
      needCp = 12
      needDu = 1
      finishActions = {"経過観察", "注視作業"}
    elseif (restProgress <= 816) then
      needCp = 25
      needDu = 6
      finishActions = {"倹約作業", "模範作業"}
    elseif (restProgress <= 862) then
      needCp = 30
      needDu = 6
      finishActions = {"倹約作業", "経過観察", "注視作業"}
    elseif (restProgress <= 1224) then
      needCp = 43
      needDu = 6
      finishActions = {"ヴェネレーション", "倹約作業", "模範作業"}
    elseif (restProgress <= 1293) then
      needCp = 48
      needDu = 6
      finishActions = {"ヴェネレーション", "倹約作業", "経過観察", "注視作業"}
    else
      -- "到達しないはず"
    end
    -- 仮: イノベ, 倹約, 倹約, グレスラ, ビエルゴ: CP124, 耐久20
    needDu = needDu + 20
    needCp = needCp + 124
    -- 品質上げフェーズ
    inner = 0
    while (true) do
        if (inner >= 8) then
            break
        end
        -- いい状態なら早めに切り上げ
        if (wasteNot < 1) then
            if (HasCondition("高能率") and manipulation < 2) then
                break
            end
            if (HasCondition("長持続") and manipulation < 1) then
                break
            end
        end
        if (wasteNot > 0) then
            if (HasCondition("高品質")) then
                yield("/ac 集中加工 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
                inner = inner + 1
                restDu = restDu - 5
            else
                yield("/ac 下地加工 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
                inner = inner + 2
                restDu = restDu - 10
            end
        elseif (manipulation > 0) then
            if (HasCondition("高品質")) then
                yield("/ac 集中加工 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
                inner = inner + 1
                restDu = restDu - 5
            elseif (HasCondition("頑丈")) then
                if (needCp + 40 <= GetCp() and needDu + 10 <= restDu) then
                    yield("/ac 下地加工 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
                    inner = inner + 2
                    restDu = restDu - 10
                else
                    break
                end
            else
                if (needCp + 25 <= GetCp() and needDu + 5 <= restDu) then
                    yield("/ac 倹約加工 <wait.3>"); manipulation = manipulation - 1; wasteNot = wasteNot - 1
                    inner = inner + 1
                    restDu = restDu - 6
                else
                    break
                end
            end
        else
            break
        end
    end

    -- 更新
    maniCp = HasCondition("高能率") and 48 or 96
    if (GetCp() - maniCp >= needCp) then
        if (HasCondition("長持続")) then
            manipulation = 10
        else
            manipulation = 8
        end
        yield("/ac マニピュレーション <wait.3>")
        restDu = GetDurability() + 5 * manipulation
    else
        -- 到達しないはず
        restDu = GetDurability()
    end

    -- 後半
    while (inner < 8) do
        if (HasCondition("高品質")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 18 <= GetCp()) then
                yield("/ac 集中加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 10
                inner = inner + 1
                goto continue
            end
        elseif (HasCondition("頑丈")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 40 <= GetCp()) then
                yield("/ac 下地加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 10
                inner = inner + 2
                goto continue
            elseif (needDu + 5 <= restDu and GetDurability() > 5 and needCp + 18 <= GetCp()) then
                yield("/ac 加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 5
                inner = inner + 1
                goto continue
            end
        else
            if (needDu + 30 <= restDu and GetDurability() > 15 and needCp + 54 <= GetCp()) then
                yield("/ac 加工 <wait.3>"); manipulation = manipulation - 1
                yield("/ac 中級加工 <wait.3>"); manipulation = manipulation - 1
                action = HasCondition("高品質") and "集中加工" or "上級加工"
                yield("/ac " .. action .. " <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 30
                inner = inner + 3
                goto continue
            elseif (needDu + 5 <= restDu and GetDurability() > 5 and needCp + 25 <= GetCp()) then
                yield("/ac 倹約加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 5
                inner = inner + 1
                goto continue
            end
        end
        -- 何も実行できない場合は抜ける
        break
        ::continue::
    end

    -- 余力で品質上げ
    while (true) do
        -- 耐久消費をしないアクションを使った際に、マニピュレーションが無駄になる量
        lostRestDu = manipulation > 0 and math.max(GetDurability() + 5 - GetMaxDurability(), 0) or 0
        masterCp = HasCondition("高能率") and 44 or 88
        if (HasCondition("高品質")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 18 <= GetCp()) then
                yield("/ac 集中加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 10
                inner = inner + 1
                goto continue2
            elseif (needDu + lostRestDu <= restDu) then
                yield("/ac 秘訣 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - lostRestDu
                goto continue2
            end
        elseif (HasCondition("頑丈")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 40 <= GetCp()) then
                yield("/ac 下地加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 10
                inner = inner + 2
                goto continue2
            elseif (needDu + 5 <= restDu and GetDurability() > 5 and needCp + 18 <= GetCp()) then
                yield("/ac 加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 5
                inner = inner + 1
                goto continue2
            end
        elseif (HasCondition("良兆候")) then
            if (needDu + 10 + lostRestDu <= restDu and GetDurability() > 5 and needCp + 25 <= GetCp()) then
                yield("/ac 経過観察 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - lostRestDu
                yield("/ac 集中加工 <wait.3>"); manipulation = manipulation - 1
                restDu = restDu - 10
                inner = inner + 1
                goto continue2
            end
        elseif (inner >= 10 and needDu + lostRestDu <= restDu and needCp + 32 < GetCp()) then
            yield("/ac 匠の神業 <wait.3>"); manipulation = manipulation - 1
            restDu = restDu - lostRestDu
            goto continue2
        elseif (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 18 < GetCp()) then
            yield("/ac 加工 <wait.3>"); manipulation = manipulation - 1
            restDu = restDu - 10
            inner = inner + 1
            goto continue2
        elseif (needDu + lostRestDu <= restDu and needCp + masterCp <= GetCp() and manipulation <= 0) then
            upDu = math.min(GetMaxDurability() - GetDurability(), 30)
            yield("/ac マスターズメンド <wait.3>"); manipulation = manipulation - 1
            restDu = restDu + upDu
            restDu = restDu - lostRestDu
            goto continue2
        elseif (needDu + 10 <= restDu and GetDurability() > 10) then
            yield("/ac ヘイスティタッチ <wait.3>"); manipulation = manipulation - 1
            restDu = restDu - 10
            -- 成功失敗が不明なのでinnerを計算できない
            goto continue2
        elseif (needDu + lostRestDu <= restDu and needCp + 7 <= GetCp() and (needCp + 7 + 44 <= GetCp() or needDu + 5 <= restDu)) then
            yield("/ac 経過観察 <wait.3>"); manipulation = manipulation - 1
            restDu = restDu - lostRestDu
            goto continue2
        end
        break
        ::continue2::
    end

    -- 仕上げ
    yield("/ac イノベーション <wait.3>")
    if (HasCondition("良兆候")) then
        yield("/ac 倹約加工 <wait.3>")
        restDu = restDu - 5
    end
    if (HasCondition("良兆候")) then
        yield("/ac 倹約加工 <wait.3>")
        restDu = restDu - 5
    end
    yield("/ac グレートストライド <wait.3>")
    yield("/ac ビエルゴの祝福 <wait.3>")
    restDu = restDu - 10

    -- 完成
    for action in pairs(finishActions) do
        yield("/ac " .. action .. " <wait.3>")
    end
end
