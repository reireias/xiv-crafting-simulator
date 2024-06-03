-- 最終段階、マイスター、飯のみ

count = 30 -- ループ数
wasteNot = 0 -- 倹約の残ターン数
manipulation = 0 -- マニピュレーションの残ターン数

-- アクションを実行し、各種バフの数値を更新する
function ac(action)
    yield("/ac " .. action .. " <wait.3>")

    if (action == "倹約") then
        wasteNot = HasCondition("長持続") and 6 or 4
    elseif (action == "長期倹約") then
        wasteNot = HasCondition("長持続") and 10 or 8
    else
        wasteNot = math.max(wasteNot - 1, 0)
    end

    if (action == "マニピュレーション") then
        manipulation = HasCondition("長持続") and 10 or 8
    else
        manipulation = math.max(manipulation - 1, 0)
    end

    if (action == "加工" or action == "中級加工" or action == "上級加工" or action == "倹約加工") then
        inner = math.min(inner + 1, 10)
    elseif (action == "集中加工" or action == "下地加工") then
        inner = math.min(inner + 2, 10)
    elseif (action == "ビエルゴの祝福") then
        inner = 0
    end
end

for i = 1, count do
    -- 初期化
    wasteNot = 0
    manipulation = 0
    inner = 0

    yield("/echo 残り" .. count - i + 1 .. "回")
    yield("/click synthesize <wait.2>")
    yield("/waitaddon Synthesis")

    -- 初期
    ac("確信")
    ac("マニピュレーション")

    -- 工数上げ
    yield("/echo 工数上げフェーズ")
    ac(HasCondition("高能率") and "長期倹約" or "倹約")
    ac("ヴェネレーション")
    ac(HasCondition("高品質") and "集中作業" or "下地作業")
    ac(HasCondition("高品質") and "集中作業" or "下地作業")

    -- 進捗: 3929 - 5558
    if (HasCondition("高進捗")) then
        if (GetProgress() + 1837 < 7040) then
            ac("下地作業")
        else
            ac("模範作業")
        end
    elseif (HasCondition("高品質")) then
        ac("集中作業")
    else
        ac("下地作業")
    end
    -- 進捗: 5173 - 6942
    if (wasteNot > 0 or HasCondition("頑丈")) then
        if (HasCondition("高進捗")) then
            if (GetProgress() + 1837 < 7040) then
                ac("下地作業")
            elseif (GetProgress() + 918 < 7040) then
                ac("模範作業")
            end
        else
            if (GetProgress() + 1225 < 7040) then
                ac("下地作業")
            elseif (GetProgress() + 612 < 7040) then
                ac("模範作業")
            end
        end
    elseif (HasCondition("高品質")) then
        if (GetProgress() + 1362 < 7040) then
            ac("集中作業")
        elseif (GetProgress() + 612 < 7040) then
            ac("模範作業")
        end
    elseif (HasCondition("高進捗")) then
        if (GetProgress() + 918 < 7040) then
            ac("倹約作業")
        end
    else
        if (GetProgress() + 612 < 7040) then
            ac("倹約作業")
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
    yield("/echo 品質上げフェーズ")
    restDu = GetDurability() + 5 * math.max(manipulation, 0)
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
                ac("集中加工")
                restDu = restDu - 5
            else
                ac("下地加工")
                restDu = restDu - 10
            end
        elseif (manipulation > 0) then
            if (HasCondition("高品質")) then
                ac("集中加工")
                restDu = restDu - 5
            elseif (HasCondition("頑丈")) then
                if (needCp + 40 <= GetCp() and needDu + 10 <= restDu) then
                    ac("下地加工")
                    restDu = restDu - 10
                else
                    break
                end
            else
                if (needCp + 25 <= GetCp() and needDu + 5 <= restDu) then
                    ac("倹約加工")
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
        ac("マニピュレーション")
        restDu = GetDurability() + 5 * math.max(manipulation, 0)
    else
        -- 到達しないはず
        restDu = GetDurability()
    end

    -- 後半
    yield("/echo 品質上げフェーズ 後半")
    while (inner < 8) do
        if (HasCondition("高品質")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 18 <= GetCp()) then
                ac("集中加工")
                restDu = restDu - 10
                goto continue
            end
        elseif (HasCondition("頑丈")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 40 <= GetCp()) then
                ac("下地加工")
                restDu = restDu - 10
                goto continue
            elseif (needDu + 5 <= restDu and GetDurability() > 5 and needCp + 18 <= GetCp()) then
                ac("加工")
                restDu = restDu - 5
                goto continue
            end
        else
            if (needDu + 30 <= restDu and GetDurability() > 15 and needCp + 54 <= GetCp()) then
                ac("加工")
                ac("中級加工")
                ac(HasCondition("高品質") and "集中加工" or "上級加工")
                restDu = restDu - 30
                goto continue
            elseif (needDu + 5 <= restDu and GetDurability() > 5 and needCp + 25 <= GetCp()) then
                ac("倹約加工")
                restDu = restDu - 5
                goto continue
            end
        end
        -- 何も実行できない場合は抜ける
        break
        ::continue::
    end

    -- 余力で品質上げ
    yield("/echo 品質上げフェーズ 余力")
    while (true) do
        -- 耐久消費をしないアクションを使った際に、マニピュレーションが無駄になる量
        lostRestDu = manipulation > 0 and math.max(GetDurability() + 5 - GetMaxDurability(), 0) or 0
        masterCp = HasCondition("高能率") and 44 or 88
        if (HasCondition("高品質")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 18 <= GetCp()) then
                ac("集中加工")
                restDu = restDu - 10
                goto continue2
            elseif (needDu + lostRestDu <= restDu) then
                ac("秘訣")
                restDu = restDu - lostRestDu
                goto continue2
            end
        elseif (HasCondition("頑丈")) then
            if (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 40 <= GetCp()) then
                ac("下地加工")
                restDu = restDu - 10
                goto continue2
            elseif (needDu + 5 <= restDu and GetDurability() > 5 and needCp + 18 <= GetCp()) then
                ac("加工")
                restDu = restDu - 5
                goto continue2
            end
        elseif (HasCondition("良兆候")) then
            if (needDu + 10 + lostRestDu <= restDu and GetDurability() > 5 and needCp + 25 <= GetCp()) then
                ac("経過観察")
                restDu = restDu - lostRestDu
                ac("集中加工")
                restDu = restDu - 10
                goto continue2
            end
        elseif (inner == 10 and needDu + lostRestDu <= restDu and needCp + 32 < GetCp()) then
            ac("匠の神業")
            restDu = restDu - lostRestDu
            goto continue2
        elseif (needDu + 10 <= restDu and GetDurability() > 10 and needCp + 18 < GetCp()) then
            ac("加工")
            restDu = restDu - 10
            goto continue2
        elseif (needDu + lostRestDu <= restDu and needCp + masterCp <= GetCp() and manipulation <= 0) then
            upDu = math.min(GetMaxDurability() - GetDurability(), 30)
            ac("マスターズメンド")
            restDu = restDu + upDu
            restDu = restDu - lostRestDu
            goto continue2
        elseif (needDu + 10 <= restDu and GetDurability() > 10) then
            ac("ヘイスティタッチ")
            restDu = restDu - 10
            -- 成功失敗が不明なのでinnerを計算できない
            goto continue2
        elseif (needDu + lostRestDu <= restDu and needCp + 7 <= GetCp() and (needCp + 7 + 44 <= GetCp() or needDu + 5 <= restDu)) then
            ac("経過観察")
            restDu = restDu - lostRestDu
            goto continue2
        end
        break
        ::continue2::
    end

    -- 仕上げ
    yield("/echo 仕上げフェーズ")
    ac("イノベーション")
    if (not HasCondition("良兆候")) then
        ac("倹約加工")
        restDu = restDu - 5
    end
    if (not HasCondition("良兆候")) then
        ac("倹約加工")
        restDu = restDu - 5
    end
    ac("グレートストライド")
    ac("ビエルゴの祝福")
    restDu = restDu - 10

    -- 完成
    yield("/echo 完成フェーズ")
    for i, action in pairs(finishActions) do
        ac(action)
    end
end
