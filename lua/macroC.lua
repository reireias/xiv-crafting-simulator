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
                innner = inner + 1
                goto continue
            end
        elseif (HasCondition("頑丈")) then
        else
        end
        -- 何も実行できない場合は抜ける
        break
        ::continue::
    end
end
