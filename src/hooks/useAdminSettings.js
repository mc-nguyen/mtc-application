// src/hooks/useAdminSettings.js - FIX LỖI INFINITE RERENDER
import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import deepEqual from 'fast-deep-equal';

const SETTINGS_DOC_ID = 'mtc-settings';
const createUniqueId = () => Date.now(); 

const areSettingsEqual = deepEqual; 

const DEFAULT_SETTINGS = {
    annualFee: 50, 
    uniformShirtPrice: 25, 
    uniformSkortPrice: 25, 
    scarfPrice: 10,
    campName: 'Bình Minh Camp', 
    campCost: 'Sẽ thông báo sau',
    isRegistrationOpen: true, 
    chaplainName: 'Cha Tuyên Úy',
    registrationTeam: [{ id: createUniqueId(), name: 'Tên Ban Ghi Danh 1', phone: '123-456-7890' }],
    troopLeaderName: 'Tên Đoàn Trưởng', 
    troopLeaderPhone: '',
    blacklistPhones: '', 
    blacklistEmails: '',
    campLocation: 'KKOTTONGNAE RETREAT CENTER, 37885 Woodchuck Rd, Temecula, CA 92592',
    campTime: 'Friday, April 25th at 2 pm - Sunday, April 27th 2025 at 11 am',
    campDeadline: '2 tháng 3 năm 2025',
    adminContactName: 'Trưởng Quốc Dũng (Đoàn Phó Quản Trị)',
    adminContactPhone: '(951) 215-1379',
};

export function useAdminSettings() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [initialSettings, setInitialSettings] = useState(DEFAULT_SETTINGS); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    
    // FIX: Sử dụng useMemo để tránh tạo mới settingsRef mỗi lần render
    const settingsRef = useMemo(() => 
        doc(db, 'artifacts', 'mtc-applications', 'public', 'data', 'config', SETTINGS_DOC_ID),
        [] // Empty dependency array - chỉ tạo một lần
    );

    // FIX: Chỉ fetch settings một lần khi component mount
    useEffect(() => {
        let isMounted = true; 

        const fetchSettings = async () => {
            if (!isMounted) return;
            console.log('🔄 Bắt đầu fetch settings...');
            setLoading(true);
            setError(null);
            
            try {
                console.log('📡 Đang kết nối Firestore...');
                const docSnap = await getDoc(settingsRef);
                console.log('📄 Kết quả Firestore:', docSnap.exists() ? 'Tồn tại' : 'Không tồn tại');
                
                let mergedSettings = DEFAULT_SETTINGS;

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('📊 Dữ liệu từ Firestore:', data);
                    
                    const teamFromDB = Array.isArray(data.registrationTeam)
                        ? data.registrationTeam.map(member => ({ ...member, id: member.id || createUniqueId() }))
                        : DEFAULT_SETTINGS.registrationTeam;
                    
                    const blacklistPhones = Array.isArray(data.blacklistPhones) 
                        ? data.blacklistPhones.join(', ') 
                        : (data.blacklistPhones || '');
                    const blacklistEmails = Array.isArray(data.blacklistEmails) 
                        ? data.blacklistEmails.join(', ') 
                        : (data.blacklistEmails || '');
                    
                    mergedSettings = { 
                        ...DEFAULT_SETTINGS, 
                        ...data, 
                        registrationTeam: teamFromDB,
                        blacklistPhones,
                        blacklistEmails
                    };
                    console.log('🎯 Settings sau khi merge:', mergedSettings);
                } else {
                    console.log('📝 Tạo document mới với default settings');
                    await setDoc(settingsRef, DEFAULT_SETTINGS);
                }

                if (!isMounted) return; 
                console.log('✅ Set settings state:', mergedSettings);
                setSettings(mergedSettings);
                setInitialSettings(mergedSettings); 
            } catch (err) {
                if (!isMounted) return;
                console.error('🚨 Lỗi khi fetch settings:', err);
                setError('Lỗi khi tải cài đặt: ' + err.message);
                // Vẫn set default settings để UI có thể hiển thị
                setSettings(DEFAULT_SETTINGS);
                setInitialSettings(DEFAULT_SETTINGS);
            } finally {
                if (isMounted) {
                    console.log('🏁 Kết thúc fetch, set loading = false');
                    setLoading(false);
                }
            }
        };
        
        fetchSettings();
        
        return () => { 
            console.log('🧹 Cleanup useEffect');
            isMounted = false; 
        };
    }, [settingsRef]); // ✅ Chỉ phụ thuộc vào settingsRef ổn định

    const saveSettings = useCallback(async (newSettings) => {
        console.log('💾 Bắt đầu lưu settings:', newSettings);
        setLoading(true);
        setError(null);
        try {
            const teamToSave = newSettings.registrationTeam
                .map(({ id, ...rest }) => rest)
                .filter(member => member.name.trim() !== '' || member.phone.trim() !== '');

            const blacklistPhones = newSettings.blacklistPhones
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
                
            const blacklistEmails = newSettings.blacklistEmails
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== '');

            const settingsToSave = { 
                ...newSettings, 
                registrationTeam: teamToSave,
                blacklistPhones,
                blacklistEmails
            };

            console.log('📤 Đang lưu lên Firestore:', settingsToSave);
            await setDoc(settingsRef, settingsToSave, { merge: true }); 
            console.log('✅ Lưu Firestore thành công');
            
            setSettings(newSettings);
            setInitialSettings(newSettings); 
            
            return { success: true }; 
        } catch (err) {
            console.error('🚨 Lỗi khi lưu settings:', err);
            setError('Lỗi khi lưu cài đặt: ' + err.message);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    }, [settingsRef]);

    const updateLocalSetting = useCallback((name, value) => {
        console.log('✏️ Update setting:', name, value);
        setSettings(prev => ({ ...prev, [name]: value }));
    }, []);
    
    const updateRegistrationTeam = useCallback((index, field, value) => {
        console.log('👥 Update team member:', index, field, value);
        setSettings(prev => {
            const newTeam = [...prev.registrationTeam];
            if (newTeam[index]) { 
                newTeam[index] = { ...newTeam[index], [field]: value }; 
            }
            return { ...prev, registrationTeam: newTeam };
        });
    }, []);

    const addRegistrationTeamMember = useCallback(() => {
        console.log('➕ Thêm thành viên mới');
        setSettings(prev => ({
            ...prev,
            registrationTeam: [...prev.registrationTeam, { id: createUniqueId(), name: '', phone: '' }]
        }));
    }, []);

    const removeRegistrationTeamMember = useCallback((idToRemove) => {
        console.log('➖ Xóa thành viên:', idToRemove);
        setSettings(prev => ({
            ...prev,
            registrationTeam: prev.registrationTeam.filter(member => member.id !== idToRemove)
        }));
    }, []);
    
    const resetToInitial = useCallback(() => {
        console.log('🔄 Reset về settings ban đầu');
        setSettings(initialSettings);
    }, [initialSettings]);
    
    const hasLocalChanges = !areSettingsEqual(settings, initialSettings);
    
    return {
        settings,
        initialSettings,
        loading,
        error,
        saveSettings,
        updateLocalSetting,
        updateRegistrationTeam,
        addRegistrationTeamMember,
        removeRegistrationTeamMember,
        resetToInitial,
        hasLocalChanges,
    };
}

export function useCampSettings() {
    const { settings, loading } = useAdminSettings();
    
    // Tách các thông tin liên quan đến trại ra ngoài
    const campInfo = useMemo(() => ({
        name: settings.campName,
        location: settings.campLocation,
        time: settings.campTime,
        deadline: settings.campDeadline,
        contacts: [
            { name: settings.troopLeaderName, phone: settings.troopLeaderPhone },
            { name: settings.adminContactName, phone: settings.adminContactPhone },
        ],
        // Loại bỏ 'fees' ở đây theo yêu cầu
    }), [settings]);

    return {
        campInfo,
        loading,
    };
}