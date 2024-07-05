import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () => {

    const [callList, setCallList] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const client = useStreamVideoClient();
    const { user } =  useUser();
    
    useEffect(() => {
        const loadCalls = async () => {
            if (!client || !user?.id) return;

            setIsLoading(true);
            try{
                const { calls } = await client.queryCalls({
                    sort: [
                        {field: 'starts_at', direction: -1}],
                    filter_conditions: {
                        starts_at : {$exists: true},
                        $or: [
                            { created_by_user_id: user.id },
                            { members: { $in: [user.id] } }
                        ]
                    }
                });
                setCallList(calls);
            } catch(error) {
                console.log(error);
            } finally {
                setIsLoading(false); 
            }
        };
        loadCalls();

    }, []);

    const now = new Date();
    const previousCalls = callList.filter(({ state : {startsAt, endedAt}}: Call) => {
        return (
            startsAt && new Date(startsAt) < now || !!endedAt
        );
    });
    const upcomingCalls = callList.filter(({ state : { startsAt }} : Call) => {
        return (
            startsAt && new Date(startsAt) > now
        );
    });

    console.log('upcomingCalls : ', upcomingCalls);

    return { 
        previousCalls,
        upcomingCalls,
        callRecordings: callList,
        isLoading
    };
}